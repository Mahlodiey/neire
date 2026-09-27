'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

interface SignalSummary {
  averageMastery: number;
  accuracy: number;
  strongTopics: string[];
  weakTopics: string[];
  draftSignals: {
    needsSupport: boolean;
    readyForChallenge: boolean;
  };
}

interface PathItem {
  title: string;
  activity: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function PersonalizedLearningPathPage() {
  const [signals, setSignals] = useState<SignalSummary | null>(null);
  const [path, setPath] = useState<PathItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please sign in to view your personalized learning path.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<{ success: boolean; signals: SignalSummary; path: PathItem[] }>(
          `${API_URL}/learning-paths/personalized`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSignals(response.data.signals);
        setPath(response.data.path);
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Unable to load learning path.' : 'Unable to load learning path.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const highlighted = useMemo(() => {
    if (!signals) return [];
    return [
      { label: 'Average mastery', value: `${signals.averageMastery}%` },
      { label: 'Accuracy', value: `${signals.accuracy}%` },
      { label: 'Weak topics', value: signals.weakTopics.length ? signals.weakTopics.join(', ') : 'None' },
      { label: 'Strong topics', value: signals.strongTopics.length ? signals.strongTopics.join(', ') : 'None' },
    ];
  }, [signals]);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Personalized learning path</p>
          <h1 className="text-4xl font-bold mt-2">Adaptive study plan</h1>
        </div>

        {loading && <div className="rounded-2xl border border-purple-500/10 bg-black/20 p-8 text-gray-400">Generating your plan...</div>}
        {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">{error}</div>}

        {!loading && signals && (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {highlighted.map((item) => (
                <div key={item.label} className="rounded-2xl border border-purple-500/10 bg-black/20 p-5">
                  <div className="text-sm text-gray-400">{item.label}</div>
                  <div className="mt-3 text-xl font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            <section className="bg-black/20 border border-purple-500/10 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-5">Recommended sequence</h2>
              <div className="space-y-4">
                {path.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="rounded-xl border border-purple-500/10 bg-slate-900/50 p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="font-semibold text-lg">{index + 1}. {item.title}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.priority === 'high' ? 'bg-red-500/10 text-red-300' : item.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-300' : 'bg-green-500/10 text-green-300'}`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="text-purple-300 font-medium">{item.activity}</div>
                    <p className="text-gray-300 mt-2">{item.reason}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
