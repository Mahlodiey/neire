import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APIError, handleError } from '@/lib/errors';
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
    // Extract user ID from auth header (implement proper auth later)
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      throw new APIError(401, 'Unauthorized: User ID required', 'AUTH_MISSING');
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = (formData.get('title') as string) || file.name;
    const description = (formData.get('description') as string) || '';

    if (!file) {
      throw new APIError(400, 'No file provided', 'FILE_MISSING');
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new APIError(400, validation.error || 'Invalid file', 'VALIDATION_ERROR');
    }

    // Generate storage key
    const storageKey = generateStorageKey(userId, file.name);

    // Upload to S3
    let s3Url: string | null = null;
    if (process.env.AWS_S3_BUCKET) {
      const buffer = await file.arrayBuffer();
      s3Url = await uploadFileToS3(storageKey, Buffer.from(buffer), file.type);
    }

    // Extract text content
    let sourceText = '';
    try {
      sourceText = await extractTextFromFile(file);
    } catch (err) {
      console.warn('Text extraction failed:', err);
      // Continue without text extraction for now
    }

    // Create study material record
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

    // Chunk and store text if available
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

    // Trigger background processing (implement later)
    // This would extract topics, generate questions, etc.
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${material.id}/process`, {
      method: 'POST',
      headers: { 'x-user-id': userId },
    }).catch((err) => console.error('Failed to trigger processing:', err));

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
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      throw new APIError(401, 'Unauthorized: User ID required', 'AUTH_MISSING');
    }

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

    return NextResponse.json(
      {
        success: true,
        materials,
      },
      { status: 200 }
    );
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}
