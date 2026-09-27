import { useMemo, useState } from 'react';

interface TopicSkill {
  name: string;
  mastery: number;
  confidence: number;
  lastPracticed: string;
  recommendation: string;
}

const sampleSkills: TopicSkill[] = [
  {
    name: 'Photosynthesis',
    mastery: 72,
    confidence: 68,
    lastPracticed: '2 days ago',
    recommendation: 'Review the light-dependent reactions and complete 2 quick practice questions.'
  },
  {
    name: 'Cell Division',
    mastery: 54,
    confidence: 49,
    lastPracticed: 'Yesterday',
    recommendation: 'Revisit mitosis stages and compare them with meiosis.'
  },
  {
    name: 'Ecosystems',
    mastery: 81,
    confidence: 84,
    lastPracticed: '1 week ago',
    recommendation: 'Keep current with a short recap quiz and a concept summary.'
  },
  {
    name: 'Forces and Motion',
    mastery: 46,
    confidence: 41,
    lastPracticed: 'Today',
    recommendation: 'Focus on Newton’s laws with guided explanation and a short review set.'
  }
];

export default function ReviewPage() {
  const [selectedTopic, setSelectedTopic] = useState('Photosynthesis');

  const activeTopic = useMemo(
    () => sampleSkills.find((skill) => skill.name === selectedTopic) ?? sampleSkills[0],
    [selectedTopic]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Adaptive Review</p>
          <h1 className="text-4xl font-bold mt-2">Review & Remediate</h1>
        </div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8">
          <aside className="bg-black/20 border border-purple-500/10 rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            <div className="space-y-3">
              {sampleSkills.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => setSelectedTopic(skill.name)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                    selectedTopic === skill.name
                      ? 'border-purple-500/50 bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
                      : 'border-purple-500/10 bg-purple-900/10 text-gray-300 hover:border-purple-500/30'
                  }`}
                >
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-xs text-gray-400">Mastery {skill.mastery}%</div>
                </button>
              ))}
            </div>
          </aside>

          <main className="space-y-6">
            <section className="bg-black/20 border border-purple-500/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Selected Topic</p>
                  <h2 className="text-3xl font-bold">{activeTopic.name}</h2>
                </div>
                <div className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-300">
                  Recommended: {activeTopic.recommendation.split('.')[0] + '.'}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-purple-500/10 bg-slate-900/50">
                  <div className="text-sm text-gray-400 mb-2">Mastery</div>
                  <div className="h-3 w-full bg-purple-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${activeTopic.mastery}%` }} />
                  </div>
                  <div className="mt-2 text-xl font-bold">{activeTopic.mastery}%</div>
                </div>

                <div className="p-4 rounded-xl border border-purple-500/10 bg-slate-900/50">
                  <div className="text-sm text-gray-400 mb-2">Confidence</div>
                  <div className="h-3 w-full bg-purple-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${activeTopic.confidence}%` }} />
                  </div>
                  <div className="mt-2 text-xl font-bold">{activeTopic.confidence}%</div>
                </div>
              </div>
            </section>

            <section className="bg-black/20 border border-purple-500/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Next Recommended Action</h3>
                <span className="text-sm text-gray-400">Last practiced: {activeTopic.lastPracticed}</span>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/20 text-gray-200">
                {activeTopic.recommendation}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold">
                  Review Topic
                </button>
                <button className="px-5 py-3 rounded-xl border border-purple-500/30 bg-purple-900/10 text-gray-200">
                  Practice Questions
                </button>
                <button className="px-5 py-3 rounded-xl border border-purple-500/30 bg-purple-900/10 text-gray-200">
                  Ask Tutor
                </button>
              </div>
            </section>

            <section className="bg-black/20 border border-purple-500/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Remediation Focus</h3>
              <div className="space-y-3">
                {[
                  'Revisit the concept summary and key definitions',
                  'Practice 2 short questions in the weak area',
                  'Try a short explanation challenge with the tutor',
                  'Retake a mini quiz after the explanation'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 rounded-xl border border-purple-500/10 bg-slate-900/50 text-gray-200">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
