import crypto from 'crypto';
import path from 'path';

export const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'text/markdown'];
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported. Please upload PDF, TXT, or Markdown files.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 50MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  return { valid: true };
}

export function generateStorageKey(userId: string, fileName: string): string {
  const timestamp = Date.now();
  const hash = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(fileName);
  const name = path.basename(fileName, ext);
  return `users/${userId}/materials/${timestamp}_${hash}${ext}`;
}

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    throw new Error('PDF extraction requires pdf-parse library. Install with: npm install pdf-parse');
  }

  if (file.type === 'text/plain' || file.type === 'text/markdown') {
    return await file.text();
  }

  throw new Error('Unsupported file type');
}

export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.substring(start, end).trim());
    start = end - overlap;
  }

  return chunks.filter((chunk) => chunk.length > 0);
}
