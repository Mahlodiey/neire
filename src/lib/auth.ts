import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export type AuthPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-me';
const JWT_EXPIRES_IN = '7d';

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

export function requireUserId(req: NextRequest): string {
  const token = getTokenFromRequest(req);
  if (!token) throw new Error('Missing auth token');

  const payload = verifyToken(token);
  return payload.userId;
}
