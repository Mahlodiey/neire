import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APIError, handleError } from '@/lib/errors';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      throw new APIError(401, 'Unauthorized: User ID required', 'AUTH_MISSING');
    }

    const chunks = await prisma.documentChunk.findMany({
      where: {
        material: { userId },
        materialId: params.id,
      },
      orderBy: { chunkIndex: 'asc' },
      select: {
        id: true,
        chunkIndex: true,
        content: true,
        pageNumber: true,
      },
    });

    if (!chunks.length) {
      throw new APIError(404, 'No chunks found for this material', 'CHUNKS_NOT_FOUND');
    }

    return NextResponse.json(
      {
        success: true,
        chunks,
        total: chunks.length,
      },
      { status: 200 }
    );
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}
