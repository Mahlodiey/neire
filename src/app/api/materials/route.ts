import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APIError, handleError } from '@/lib/errors';
import { requireUserId } from '@/lib/auth';
import { validateFile, generateStorageKey, extractTextFromFile, chunkText } from '@/lib/file-utils';
import { uploadFileToS3 } from '@/lib/s3';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const userId = requireUserId(req);

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || (file ? file.name : 'Untitled note');
    const description = (formData.get('description') as string) || '';

    if (!file) {
      throw new APIError(400, 'No file provided', 'FILE_MISSING');
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      throw new APIError(400, validation.error || 'Invalid file', 'VALIDATION_ERROR');
    }

    const storageKey = generateStorageKey(userId, file.name);

    if (process.env.AWS_S3_BUCKET) {
      const buffer = Buffer.from(await file.arrayBuffer());
      await uploadFileToS3(storageKey, buffer, file.type);
    }

    let sourceText = '';
    try {
      sourceText = await extractTextFromFile(file);
    } catch (error) {
      console.warn('Text extraction failed:', error);
    }

    const material = await prisma.studyMaterial.create({
      data: {
        userId,
        title,
        description,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storageKey,
        sourceText,
        status: 'UPLOADED',
      },
    });

    if (sourceText) {
      const chunks = chunkText(sourceText);
      await prisma.documentChunk.createMany({
        data: chunks.map((content, index) => ({
          materialId: material.id,
          chunkIndex: index,
          content,
        })),
      });
    }

    return NextResponse.json(
      {
        success: true,
        material: {
          id: material.id,
          title: material.title,
          fileName: material.fileName,
          status: material.status,
          createdAt: material.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);

    const materials = await prisma.studyMaterial.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        fileName: true,
        fileSize: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, materials }, { status: 200 });
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}
