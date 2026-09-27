import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APIError, handleError } from '@/lib/errors';
import { requireUserId } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = requireUserId(req);

    const material = await prisma.studyMaterial.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true },
    });

    if (!material) {
      throw new APIError(404, 'Material not found', 'MATERIAL_NOT_FOUND');
    }

    if (material.userId !== userId) {
      throw new APIError(403, 'Forbidden: Cannot access this material', 'UNAUTHORIZED');
    }

    const chunks = await prisma.documentChunk.findMany({
      where: { materialId: params.id },
      orderBy: { chunkIndex: 'asc' },
    });

    return NextResponse.json({ success: true, chunks }, { status: 200 });
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}
