'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Summary {
  totalTopics: number;
  averageMastery: number;
  accuracy: number;
  reviewDue: number;
  totalMaterials: number;
  totalAttempts: number;
  correctAttempts: number;
  activeMaterials: number;
}

interface TopicProgress {
  topicId: string;
  title: string;
  materialTitle: string;
  mastery: number;
  confidence: number;
  retention: number;
  attemptsCount: number;
  lastPracticedAt: string | null;
}

interface RecentAttempt {
  id: string;
  questionId: string;
  answer: string;
  isCorrect: boolean;
  score: number | null;
  confidence: number | null;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function ProgressPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topics, setTopics] = useState<TopicProgress[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please sign in to view progress.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<{ success: boolean; summary: Summary; topics: TopicProgress[]; recentAttempts: RecentAttempt[] }>(
          `${API_URL}/progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSummary(response.data.summary);
        setTopics(response.data.topics);
        setRecentAttempts(response.data.recentAttempts);
      } catch (err) {
        setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Unable to load progress.' : 'Unable to load progress.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const topTopic = useMemo(() => topics[0], [topics]);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Progress</p>
          <h1 className="text-4xl font-bold mt-2">Learning dashboard</h1>
        </div>

        {loading && <div className="rounded-2xl border border-purple-500/10 bg-black/20 p-8 text-gray-400">Loading your progress...</div>}
        {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">{error}</div>}

        {!loading && summary && (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {[
                ['Average mastery', `${summary.averageMastery}%`],
                ['Accuracy', `${summary.accuracy}%`],
                ['Review due', `${summary.reviewDue}`],
                ['Total attempts', `${summary.totalAttempts}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-purple-500/10 bg-black/20 p-5">
                  <div className="text-sm text-gray-400">{label}</div>
                  <div className="mt-3 text-3xl font-bold">{value}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8">
              <section className="bg-black/20 border border-purple-500/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-semibold">Topic mastery</h2>
                  <span className="text-sm text-gray-400">{summary.totalTopics} topics tracked</span>
                </div>

                <div className="space-y-4">
                  {topics.map((topic) => (
                    <div key={topic.topicId} className="rounded-xl border border-purple-500/10 bg-slate-900/40 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <div>
                          <div className="font-semibold">{topic.title}</div>
                          <div className="text-xs text-gray-400">{topic.materialTitle}</div>
                        </div>
                        <div className="text-sm text-purple-300">{topic.mastery}%</div>
                      </div>

                      <div className="h-2.5 rounded-full bg-purple-900/30 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${topic.mastery}%` }} />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                        <span>Confidence: {topic.confidence}%</span>
                        <span>Retention: {topic.retention}%</span>
                        <span>Attempts: {topic.attemptsCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="space-y-6">
                <section className="bg-black/20 border border-purple-500/10 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Summary</h2>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex justify-between"><span>Materials</span><span>{summary.totalMaterials}</span></div>
                    <div className="flex justify-between"><span>Ready/Active</span><span>{summary.activeMaterials}</span></div>
                    <div className="flex justify-between"><span>Correct</span><span>{summary.correctAttempts}</span></div>
                    <div className="flex justify-between"><span>Review due</span><span>{summary.reviewDue}</span></div>
                  </div>
                </section>

                <section className="bg-black/20 border border-purple-500/10 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Top focus</h2>
                  {topTopic ? (
                    <div>
                      <div className="text-lg font-semibold">{topTopic.title}</div>
                      <div className="text-sm text-gray-400 mt-1">{topTopic.materialTitle}</div>
                      <div className="mt-3 text-sm text-purple-300">Current mastery: {topTopic.mastery}%</div>
                      <Link href="/review" className="inline-block mt-4 text-sm text-indigo-300 hover:text-white">Open review recommendations →</Link>
                    </div>
                  ) : (
                    <div className="text-gray-400">No topic data yet.</div>
                  )}
                </section>
              </aside>
            </div>

            <section className="mt-8 bg-black/20 border border-purple-500/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent attempts</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-gray-400">
                    <tr>
                      <th className="pb-3 pr-6">Question</th>
                      <th className="pb-3 pr-6">Answer</th>
                      <th className="pb-3 pr-6">Result</th>
                      <th className="pb-3 pr-6">Score</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttempts.map((attempt) => (
                      <tr key={attempt.id} className="border-t border-purple-500/10 text-gray-200">
                        <td className="py-3 pr-6">{attempt.questionId}</td>
                        <td className="py-3 pr-6">{attempt.answer}</td>
                        <td className="py-3 pr-6">{attempt.isCorrect ? 'Correct' : 'Incorrect'}</td>
                        <td className="py-3 pr-6">{attempt.score ?? '--'}</td>
                        <td className="py-3">{new Date(attempt.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
