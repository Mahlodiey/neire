'use client';

import { useState } from 'react';

interface UploadFormProps {
  onUpload: (file: File, title: string, description: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  progress: number;
}

export function UploadForm({ onUpload, isLoading, error, progress }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      await onUpload(file, title || file.name, description);
      setFile(null);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition ${
          isDragging
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-purple-500/30 hover:border-purple-500/60'
        }`}
      >
        <input
          type="file"
          accept=".pdf,.txt,.md"
          onChange={handleFileChange}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="pointer-events-none">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold mb-2">Drop your file here</h3>
          <p className="text-gray-400 text-sm mb-4">
            or click to browse. Supports PDF, TXT, and Markdown files (max 50MB)
          </p>
          {file && <p className="text-indigo-400 font-medium">{file.name}</p>}
        </div>
      </div>

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Material Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Chapter 3: Photosynthesis"
          disabled={isLoading}
          className="w-full px-4 py-2 rounded-lg bg-purple-900/30 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes about this material..."
          disabled={isLoading}
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-purple-900/30 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/60 transition disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        />
      </div>

      {/* Progress Bar */}
      {isLoading && progress > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Uploading...</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-purple-900/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50">
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!file || !title || isLoading}
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? `Uploading... ${progress}%` : 'Upload Material'}
      </button>
    </form>
  );
}
