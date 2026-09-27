import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Material {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  status: string;
  createdAt: string;
}

interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: 'TEXT' | 'VOICE' | 'VISUAL' | 'EXAMPLE' | 'STORY' | 'CONVERSATION';
}

const MODES = ['TEXT', 'VOICE', 'VISUAL', 'EXAMPLE', 'STORY', 'CONVERSATION'] as const;

export default function LearnPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState('Photosynthesis');
  const [activeMode, setActiveMode] = useState<(typeof MODES)[number]>('TEXT');
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi! I’m NEIRE, your adaptive tutor. Select a material and ask me to explain, simplify, or practice a concept.',
      mode: 'CONVERSATION',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ success: boolean; materials: Material[] }>(
          `${process.env.NEXT_PUBLIC_API_URL}/materials`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setMaterials(response.data.materials);
          if (response.data.materials.length > 0) {
            setSelectedMaterialId(response.data.materials[0].id);
          }
        }
      } catch (err) {
        setError('Unable to load materials. Please sign in and upload a study file first.');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const selectedMaterial = useMemo(
    () => materials.find((material) => material.id === selectedMaterialId) || materials[0],
    [materials, selectedMaterialId]
  );

  const topics = useMemo(() => {
    if (!selectedMaterial) {
      return ['Photosynthesis', 'Cell Division', 'Forces and Motion', 'Ecosystems'];
    }

    const baseTopics = [
      selectedMaterial.title,
      'Key Concepts',
      'Examples',
      'Practice Review',
      'Summary',
    ];

    return baseTopics;
  }, [selectedMaterial]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: TutorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
    };

    const explanation = selectedMaterial
      ? `Based on “${selectedMaterial.title}”, here is a ${activeMode.toLowerCase()} explanation of ${selectedTopic}:\n\n${input}\n\nThink of this concept as part of a learning flow: first understand the main idea, then connect it to a real example, and finally test yourself with a recall question.`
      : `Here is a ${activeMode.toLowerCase()} explanation for ${selectedTopic}:\n\n${input}\n\nIf you upload a study file, I can tailor the explanation to that material.`;

    const assistantResponse: TutorMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: explanation,
      mode: activeMode,
    };

    setMessages((prev) => [...prev, userMessage, assistantResponse]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/60 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white">
              N
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              NEIRE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
            <button className="px-4 py-2 border border-purple-500/30 rounded-lg text-gray-200 hover:bg-purple-500/10 transition">
              Practice Quiz
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-8 h-[calc(100vh-120px)]">
          <aside className="bg-black/20 border border-purple-500/10 rounded-2xl p-5 overflow-hidden">
            <h2 className="text-xl font-bold mb-6">Materials</h2>

            {loading ? (
              <p className="text-gray-400">Loading materials...</p>
            ) : materials.length === 0 ? (
              <div className="space-y-3">
                <p className="text-gray-400">No uploaded material yet.</p>
                <Link
                  href="/dashboard"
                  className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-medium"
                >
                  Upload a file
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {materials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterialId(material.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                      selectedMaterial?.id === material.id
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-purple-500/50 text-white'
                        : 'border-purple-500/10 bg-purple-900/10 text-gray-300 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="font-medium">{material.title}</div>
                    <div className="text-xs text-gray-400">{material.fileName}</div>
                  </button>
                ))}
              </div>
            )}

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Topics</h3>
              <div className="space-y-3">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                      selectedTopic === topic
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-purple-500/50 text-white'
                        : 'border-purple-500/10 bg-purple-900/10 text-gray-300 hover:border-purple-500/30'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="bg-black/20 border border-purple-500/10 rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-purple-500/10">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Material</p>
                <h1 className="text-2xl font-bold">{selectedMaterial?.title || 'No Material Selected'}</h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                Mastery: 68%
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm text-gray-400 mb-2">Teaching mode</p>
              <div className="flex flex-wrap gap-2">
                {MODES.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      activeMode === mode
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-purple-500 text-white'
                        : 'border-purple-500/20 bg-purple-900/10 text-gray-300 hover:border-purple-500/40'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'bg-slate-800 text-slate-100 border border-purple-500/10'
                    }`}
                  >
                    {message.mode && message.role === 'assistant' && (
                      <div className="text-[10px] uppercase tracking-[0.18em] text-purple-300 mb-2">
                        {message.mode}
                      </div>
                    )}
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-purple-500/10 pt-4">
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={3}
                  placeholder="Ask for a simpler explanation, example, practice question, or a quick review..."
                  className="flex-1 px-4 py-3 rounded-xl bg-purple-900/10 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 resize-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/40 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
