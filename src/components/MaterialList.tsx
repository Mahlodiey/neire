'use client';

import { StudyMaterial } from '@/hooks/useMaterials';

interface MaterialListProps {
  materials: StudyMaterial[];
  loading: boolean;
  onDelete: (materialId: string) => Promise<boolean>;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'READY':
      return 'bg-green-500/10 text-green-400';
    case 'PROCESSING':
      return 'bg-yellow-500/10 text-yellow-400';
    case 'FAILED':
      return 'bg-red-500/10 text-red-400';
    default:
      return 'bg-blue-500/10 text-blue-400';
  }
}

export function MaterialList({ materials, loading, onDelete }: MaterialListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Loading materials...</div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📚</div>
        <div className="text-gray-400">No materials yet. Upload your first study file to get started!</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {materials.map((material) => (
        <div
          key={material.id}
          className="p-4 rounded-lg bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20 hover:border-purple-500/50 transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📄</span>
                <div>
                  <h3 className="font-semibold text-lg">{material.title}</h3>
                  <p className="text-sm text-gray-400">{material.fileName}</p>
                </div>
              </div>
              {material.description && <p className="text-sm text-gray-300 ml-11 mb-2">{material.description}</p>}
              <div className="flex items-center gap-3 ml-11">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(material.status)}`}>
                  {material.status}
                </span>
                <span className="text-xs text-gray-400">
                  {material.fileSize ? `${(material.fileSize / 1024 / 1024).toFixed(2)} MB` : 'No size'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(material.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(material.id)}
              className="text-red-400 hover:text-red-300 transition text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
