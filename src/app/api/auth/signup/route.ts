import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APIError, handleError } from '@/lib/errors';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !password) {
      throw new APIError(400, 'Email and password are required', 'VALIDATION_ERROR');
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (normalizedEmail.length === 0) {
      throw new APIError(400, 'Email is required', 'VALIDATION_ERROR');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new APIError(409, 'User with this email already exists', 'USER_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || normalizedEmail.split('@')[0],
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const token = signToken({ userId: user.id, email: user.email });

    return NextResponse.json(
      {
        success: true,
        user,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}
