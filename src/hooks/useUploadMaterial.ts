'use client';

import { useCallback, useState } from 'react';
import axios from 'axios';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadResponse {
  success: boolean;
  material?: {
    id: string;
    title: string;
    fileName: string;
    status: string;
    createdAt: string;
  };
  error?: string;
  code?: string;
}

export function useUploadMaterial() {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [material, setMaterial] = useState<UploadResponse['material'] | null>(null);

  const upload = useCallback(
    async (
      file: File,
      title: string,
      description: string,
      token: string
    ): Promise<UploadResponse | null> => {
      try {
        setStatus('uploading');
        setProgress(0);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);

        const response = await axios.post<UploadResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/materials`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              setProgress(percentCompleted);
            },
          }
        );

        if (response.data.success && response.data.material) {
          setMaterial(response.data.material);
          setStatus('success');
          return response.data;
        } else {
          throw new Error(response.data.error || 'Upload failed');
        }
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : err instanceof Error
            ? err.message
            : 'Upload failed';
        setError(errorMessage);
        setStatus('error');
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setError(null);
    setMaterial(null);
  }, []);

  return { upload, status, progress, error, material, reset };
}
