export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleError(error: unknown): { statusCode: number; message: string; code?: string } {
  if (error instanceof APIError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      message: 'Internal server error',
    };
  }

  return {
    statusCode: 500,
    message: 'Unknown error occurred',
  };
}
