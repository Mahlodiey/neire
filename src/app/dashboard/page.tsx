'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMaterials } from '@/hooks/useMaterials';
import { useUploadMaterial } from '@/hooks/useUploadMaterial';
import { UploadForm } from '@/components/UploadForm';
import { MaterialList } from '@/components/MaterialList';
import Link from 'next/link';

export default function Dashboard() {
  const { user, token, logout, restoreSession, isAuthenticated } = useAuth();
  const { materials, loading, fetchMaterials, deleteMaterial } = useMaterials(token);
  const { upload, status, progress, error, material } = useUploadMaterial();

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Fetch materials when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMaterials();
    }
  }, [isAuthenticated, fetchMaterials]);

  // Refresh materials after successful upload
  useEffect(() => {
    if (status === 'success' && material) {
      setTimeout(() => fetchMaterials(), 1000);
    }
  }, [status, material, fetchMaterials]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Welcome to NEIRE</h1>
          <p className="text-gray-400 mb-8">Please sign in to access your learning materials</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-2 border-2 border-purple-500 rounded-lg font-semibold hover:bg-purple-500/10 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleUpload = async (file: File, title: string, description: string) => {
    if (!token) {
      throw new Error('Not authenticated');
    }
    await upload(file, title, description, token);
  };

  const handleDelete = async (materialId: string) => {
    if (confirm('Are you sure you want to delete this material? This cannot be undone.')) {
      await deleteMaterial(materialId);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white">
                N
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                NEIRE
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">{user?.name || user?.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-gray-300 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="md:col-span-2">
            <div className="bg-black/20 rounded-lg p-8 border border-purple-500/10">
              <h2 className="text-2xl font-bold mb-6">Upload Study Material</h2>
              <UploadForm
                onUpload={handleUpload}
                isLoading={status === 'uploading'}
                error={error}
                progress={progress}
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-4">
            <div className="p-6 rounded-lg bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20">
              <h3 className="text-gray-400 text-sm font-semibold mb-4">YOUR STATS</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">{materials.length}</div>
                  <div className="text-gray-400 text-sm">Materials</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {materials.filter((m) => m.status === 'READY').length}
                  </div>
                  <div className="text-gray-400 text-sm">Ready to Learn</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {materials.filter((m) => m.status === 'PROCESSING').length}
                  </div>
                  <div className="text-gray-400 text-sm">Processing</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Materials List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Your Learning Materials</h2>
          <div className="bg-black/20 rounded-lg p-8 border border-purple-500/10">
            <MaterialList materials={materials} loading={loading} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}
