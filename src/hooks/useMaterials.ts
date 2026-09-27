'use client';

import { useCallback, useState } from 'react';
import axios from 'axios';

export interface StudyMaterial {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize?: number;
  status: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export function useMaterials(token: string | null) {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = useCallback(async () => {
    if (!token) {
      setError('No authentication token');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<{
        success: boolean;
        materials: StudyMaterial[];
      }>(`${process.env.NEXT_PUBLIC_API_URL}/materials`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMaterials(response.data.materials);
      } else {
        throw new Error('Failed to fetch materials');
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : err instanceof Error
          ? err.message
          : 'Failed to fetch materials';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteMaterial = useCallback(
    async (materialId: string) => {
      if (!token) {
        setError('No authentication token');
        return false;
      }

      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/materials/${materialId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMaterials((prev) => prev.filter((m) => m.id !== materialId));
        return true;
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : err instanceof Error
            ? err.message
            : 'Failed to delete material';
        setError(errorMessage);
        return false;
      }
    },
    [token]
  );

  return { materials, loading, error, fetchMaterials, deleteMaterial };
}
