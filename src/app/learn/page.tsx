import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: 'TEXT' | 'VOICE' | 'VISUAL' | 'EXAMPLE' | 'STORY' | 'CONVERSATION';
}

export default function LearnPage() {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi! I’m NEIRE, your adaptive tutor. Upload a study material or select a topic to begin. Ask me to simplify, explain, or give an example.',
      mode: 'CONVERSATION',
    },
  ]);
  const [input, setInput] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Photosynthesis');
  const [activeMode, setActiveMode] = useState<'TEXT' | 'VOICE' | 'VISUAL' | 'EXAMPLE' | 'STORY' | 'CONVERSATION'>('TEXT');

  const topics = [
    'Photosynthesis',
    'Cell Division',
    'Photosynthesis',
    'Forces and Motion',
    'Ecosystems',
  ];

  const modes = ['TEXT', 'VOICE', 'VISUAL', 'EXAMPLE', 'STORY', 'CONVERSATION'];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: TutorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
    };

    const assistantResponse: TutorMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: `Here’s a ${activeMode.toLowerCase()} explanation for ${selectedTopic}:\n\n${input}\n\nThink of it this way: the concept builds from a simple idea and becomes more complex as you connect it to real-world examples. If you want, I can simplify it, give a quick example, or turn it into a practice question.`,
      mode: activeMode,
    };

    setMessages((prev) => [...prev, userMessage, assistantResponse]);
    setInput('');
  };

  useEffect(() => {
    if (input === '') {
      return;
    }
  }, [input]);

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
        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8 h-[calc(100vh-120px)]">
          {/* Sidebar */}
          <aside className="bg-black/20 border border-purple-500/10 rounded-2xl p-5 overflow-hidden">
            <h2 className="text-xl font-bold mb-6">Topics</h2>
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

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Learning Path</h3>
              <div className="space-y-3">
                {['Explain', 'Practice', 'Recall', 'Review'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold ${
                        index === 0
                          ? 'bg-green-500/20 text-green-400'
                          : index === 1
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : index === 2
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-pink-500/20 text-pink-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="bg-black/20 border border-purple-500/10 rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-purple-500/10">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Topic</p>
                <h1 className="text-2xl font-bold">{selectedTopic}</h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                Mastery: 68%
              </div>
            </div>

            {/* Teaching Modes */}
            <div className="mb-5">
              <p className="text-sm text-gray-400 mb-2">Teaching mode</p>
              <div className="flex flex-wrap gap-2">
                {modes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode as typeof activeMode)}
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

            {/* Chat Panel */}
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

            {/* Input Box */}
            <div className="mt-4 border-t border-purple-500/10 pt-4">
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={3}
                  placeholder="Ask for a simpler explanation, another example, or practice question..."
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
