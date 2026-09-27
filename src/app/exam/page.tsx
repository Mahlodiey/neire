import { useEffect, useMemo, useState } from 'react';

interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const examQuestions: Question[] = [
  {
    id: 'exam-1',
    prompt: 'Which statement best explains why photosynthesis is essential for most ecosystems?',
    options: [
      'It converts sunlight into usable chemical energy for producers.',
      'It releases carbon monoxide into the atmosphere.',
      'It removes oxygen from the environment.',
      'It destroys glucose in plant cells.'
    ],
    correctAnswer: 'It converts sunlight into usable chemical energy for producers.',
    explanation: 'Photosynthesis captures solar energy and stores it as chemical energy in glucose, which supports producers and the wider food web.'
  },
  {
    id: 'exam-2',
    prompt: 'What is the main role of chlorophyll in photosynthesis?',
    options: [
      'It transports water to roots.',
      'It absorbs light energy.',
      'It stores glucose in leaves.',
      'It breaks down oxygen.'
    ],
    correctAnswer: 'It absorbs light energy.',
    explanation: 'Chlorophyll is the pigment that absorbs light energy, enabling the light-dependent reactions of photosynthesis.'
  },
  {
    id: 'exam-3',
    prompt: 'Why is the oxygen produced in photosynthesis important?',
    options: [
      'It helps plants absorb sunlight.',
      'It is used by animals and humans for respiration.',
      'It is stored as starch in roots.',
      'It generates carbon dioxide.'
    ],
    correctAnswer: 'It is used by animals and humans for respiration.',
    explanation: 'Oxygen released during photosynthesis is a vital by-product that supports aerobic respiration in many living organisms.'
  },
  {
    id: 'exam-4',
    prompt: 'Which of these occurs in the chloroplasts?',
    options: [
      'Cell division',
      'Photosynthesis',
      'Protein digestion',
      'DNA replication'
    ],
    correctAnswer: 'Photosynthesis',
    explanation: 'Photosynthesis mainly occurs in chloroplasts, which contain chlorophyll and other structures needed to convert light energy into chemical energy.'
  },
  {
    id: 'exam-5',
    prompt: 'What is the role of water in photosynthesis?',
    options: [
      'It provides electrons and hydrogen for the process.',
      'It creates oxygen without any reaction.',
      'It absorbs carbon dioxide from soil.',
      'It acts as a final product only.'
    ],
    correctAnswer: 'It provides electrons and hydrogen for the process.',
    explanation: 'Water is split during the light-dependent reactions, providing electrons and hydrogen necessary for producing glucose and releasing oxygen.'
  }
];

export default function ExamModePage() {
  const [questions] = useState<Question[]>(examQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, currentIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const score = useMemo(() => {
    return questions.reduce((total, question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        return total + 1;
      }
      return total;
    }, 0);
  }, [questions, selectedAnswers]);

  const handleSelect = (option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setTimeLeft(300);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-2xl w-full rounded-2xl border border-purple-500/20 bg-black/20 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300 mb-4">Exam Complete</p>
          <h1 className="text-4xl font-bold mb-4">Final Score: {score}/{questions.length}</h1>
          <p className="text-lg text-gray-300 mb-8">
            {score >= 4
              ? 'Excellent work — you are ready for the next topic.'
              : score >= 3
              ? 'Strong effort. A quick review would help reinforce the concepts.'
              : 'There are a few gaps to revisit before the next exam attempt.'}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
            {questions.map((question) => (
              <div key={question.id} className="p-4 rounded-xl border border-purple-500/20 bg-slate-900/50">
                <div className="text-sm text-purple-300 mb-2">Question</div>
                <div className="text-sm text-gray-200">{question.prompt}</div>
                <div className="mt-2 text-xs text-gray-400">
                  Your answer: {selectedAnswers[question.id] || 'Not answered'}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold"
          >
            Retake Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Exam Mode</p>
            <h1 className="text-3xl font-bold">Assessment Session</h1>
          </div>
          <div className="px-4 py-2 rounded-full border border-red-500/30 bg-red-900/20 text-red-200 font-semibold">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-black/20 border border-purple-500/10 rounded-2xl p-8">
          <div className="mb-6 flex items-center justify-between text-sm text-gray-400">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>Auto-submit at expiry</span>
          </div>

          <h2 className="text-2xl font-semibold mb-6">{currentQuestion.prompt}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-purple-500/20 bg-purple-900/10 hover:border-purple-500/40 text-gray-200'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold disabled:opacity-50"
              disabled={!selectedAnswers[currentQuestion.id]}
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Submit Exam'}
            </button>

            <div className="text-sm text-gray-400">
              {selectedAnswers[currentQuestion.id] ? 'Answer saved' : 'Choose an option'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
