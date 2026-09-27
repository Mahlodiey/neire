import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APIError, handleError } from '@/lib/errors';
import { requireUserId } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = requireUserId(req);

    const material = await prisma.studyMaterial.findUnique({
      where: { id: params.id },
    });

    if (!material) {
      throw new APIError(404, 'Material not found', 'MATERIAL_NOT_FOUND');
    }

    if (material.userId !== userId) {
      throw new APIError(403, 'Forbidden: Cannot process this material', 'UNAUTHORIZED');
    }

    await prisma.studyMaterial.update({
      where: { id: params.id },
      data: { status: 'PROCESSING' },
    });

    setTimeout(async () => {
      await prisma.studyMaterial.update({
        where: { id: params.id },
        data: { status: 'READY' },
      });
    }, 2000);

    return NextResponse.json(
      {
        success: true,
        message: 'Material processing started',
        material: {
          id: material.id,
          status: 'PROCESSING',
        },
      },
      { status: 202 }
    );
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}
