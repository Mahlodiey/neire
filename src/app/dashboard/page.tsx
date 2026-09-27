'use client';

import Link from 'next/link';

export default function Dashboard() {
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
            <button className="px-4 py-2 text-gray-300 hover:text-white transition">
              Profile
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome to NEIRE</h1>
          <p className="text-gray-400">Your personalized learning platform</p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="p-8 rounded-lg bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 transition text-center">
              <div className="text-4xl mb-4">📤</div>
              <h2 className="text-2xl font-semibold mb-2">Upload Study Material</h2>
              <p className="text-gray-300 mb-6">
                Upload your PDFs, notes, or textbooks to start your personalized learning journey.
              </p>
              <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
                Choose File
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20">
            <h3 className="text-gray-400 text-sm font-semibold mb-4">YOUR STATS</h3>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-gray-400 text-sm">Documents</div>
              </div>
              <div>
                <div className="text-2xl font-bold">0%</div>
                <div className="text-gray-400 text-sm">Average Mastery</div>
              </div>
              <div>
                <div className="text-2xl font-bold">0h</div>
                <div className="text-gray-400 text-sm">Learning Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Learning Sessions</h2>
          <div className="p-8 rounded-lg bg-purple-900/20 border border-purple-500/10 text-center">
            <p className="text-gray-400">No documents yet. Upload your first study material to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
