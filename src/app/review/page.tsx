'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Recommendation {
  topicId: string;
  topic: string;
  materialId: string;
  materialTitle: string;
  mastery: number;
  confidence: number;
  attemptsCount: number;
  lastPracticedAt: string | null;
  dueAt: string | null;
  urgency: number;
  action: string;
  label: string;
  reason: string;
  steps: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

function formatDate(value: string | null) {
  if (!value) return 'Not practiced yet';
  return new Date(value).toLocaleDateString();
}

export default function ReviewPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please sign in to see your personalized recommendations.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<{ success: boolean; recommendations: Recommendation[] }>(
        `${API_URL}/review/recommendations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecommendations(response.data.recommendations);
      setSelectedTopicId((current) => current || response.data.recommendations[0]?.topicId || null);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Unable to load recommendations.' : 'Unable to load recommendations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const activeTopic = useMemo(
    () => recommendations.find((item) => item.topicId === selectedTopicId) || recommendations[0],
    [recommendations, selectedTopicId]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Adaptive Review</p>
            <h1 className="text-4xl font-bold mt-2">Your next best actions</h1>
            <p className="text-gray-400 mt-2">Recommendations are calculated from your mastery, confidence, attempts, and review schedule.</p>
          </div>
          <button onClick={loadRecommendations} className="px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/10 transition">
            Refresh recommendations
          </button>
        </div>

        {loading && <div className="rounded-2xl border border-purple-500/10 bg-black/20 p-8 text-gray-400">Analyzing your learning history...</div>}
        {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">{error}</div>}

        {!loading && !error && recommendations.length === 0 && (
          <div className="rounded-2xl border border-purple-500/10 bg-black/20 p-8 text-gray-300">
            Complete a practice question or upload material with topics to start receiving personalized recommendations.
            <div className="mt-4"><Link href="/learn" className="text-purple-300 hover:text-white">Go to tutor →</Link></div>
          </div>
        )}

        {!loading && !error && recommendations.length > 0 && (
          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
            <aside className="bg-black/20 border border-purple-500/10 rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-4">Priority topics</h2>
              <div className="space-y-3">
                {recommendations.map((item) => (
                  <button key={item.topicId} onClick={() => setSelectedTopicId(item.topicId)} className={`w-full text-left px-4 py-3 rounded-xl border transition ${selectedTopicId === item.topicId ? 'border-purple-500/50 bg-gradient-to-r from-indigo-500/20 to-purple-500/20' : 'border-purple-500/10 bg-purple-900/10 text-gray-300 hover:border-purple-500/30'}`}>
                    <div className="font-medium">{item.topic}</div>
                    <div className="text-xs text-gray-400">{item.materialTitle} · {item.mastery}% mastery</div>
                  </button>
                ))}
              </div>
            </aside>

            <main className="space-y-6">
              <section className="bg-black/20 border border-purple-500/10 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Recommended now</p>
                    <h2 className="text-3xl font-bold">{activeTopic.topic}</h2>
                    <p className="text-sm text-gray-400 mt-1">From {activeTopic.materialTitle} · Last practiced: {formatDate(activeTopic.lastPracticedAt)}</p>
                  </div>
                  <span className="px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-200">Priority {activeTopic.urgency}%</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    ['Mastery', activeTopic.mastery, 'from-indigo-500 to-purple-600'],
                    ['Confidence', activeTopic.confidence, 'from-cyan-500 to-blue-500'],
                  ].map(([label, value, gradient]) => (
                    <div key={label as string} className="p-4 rounded-xl border border-purple-500/10 bg-slate-900/50">
                      <div className="text-sm text-gray-400 mb-2">{label}</div>
                      <div className="h-3 w-full bg-purple-900/30 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${gradient}`} style={{ width: `${value}%` }} /></div>
                      <div className="mt-2 text-xl font-bold">{value}%</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-black/20 border border-purple-500/10 rounded-2xl p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Next recommended action</p>
                <h3 className="text-2xl font-semibold mt-2">{activeTopic.label}</h3>
                <p className="text-gray-300 mt-3">{activeTopic.reason}</p>
                <div className="mt-5 space-y-3">{activeTopic.steps.map((step) => <div key={step} className="flex items-center gap-3 p-3 rounded-xl border border-purple-500/10 bg-slate-900/50"><span className="w-2 h-2 rounded-full bg-purple-500" />{step}</div>)}</div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/learn?topicId=${activeTopic.topicId}`} className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold">Open tutor</Link>
                  <Link href={`/practice?topicId=${activeTopic.topicId}`} className="px-5 py-3 rounded-xl border border-purple-500/30 bg-purple-900/10">Practice now</Link>
                </div>
              </section>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
