import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APIError, handleError } from '@/lib/errors';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      throw new APIError(401, 'Unauthorized: User ID required', 'AUTH_MISSING');
    }

    const material = await prisma.studyMaterial.findUnique({
      where: { id: params.id },
      include: {
        chunks: {
          select: {
            id: true,
            chunkIndex: true,
            pageNumber: true,
          },
          take: 10,
        },
        topics: {
          select: {
            id: true,
            title: true,
            position: true,
          },
          take: 5,
        },
      },
    });

    if (!material) {
      throw new APIError(404, 'Material not found', 'MATERIAL_NOT_FOUND');
    }

    if (material.userId !== userId) {
      throw new APIError(403, 'Forbidden: Cannot access this material', 'UNAUTHORIZED');
    }

    return NextResponse.json(
      {
        success: true,
        material,
      },
      { status: 200 }
    );
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      throw new APIError(401, 'Unauthorized: User ID required', 'AUTH_MISSING');
    }

    const material = await prisma.studyMaterial.findUnique({
      where: { id: params.id },
    });

    if (!material) {
      throw new APIError(404, 'Material not found', 'MATERIAL_NOT_FOUND');
    }

    if (material.userId !== userId) {
      throw new APIError(403, 'Forbidden: Cannot delete this material', 'UNAUTHORIZED');
    }

    // Delete from S3 if stored there
    if (material.storageKey && process.env.AWS_S3_BUCKET) {
      // TODO: Implement S3 deletion
      // await deleteFileFromS3(material.storageKey);
    }

    // Cascading delete handled by database
    await prisma.studyMaterial.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Material deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}
