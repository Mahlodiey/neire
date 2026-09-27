import { useState } from 'react';

interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const sampleQuestions: Question[] = [
  {
    id: 'q1',
    prompt: 'Which process allows plants to convert light energy into chemical energy?',
    options: ['Respiration', 'Photosynthesis', 'Evaporation', 'Transpiration'],
    correctAnswer: 'Photosynthesis',
    explanation:
      'Photosynthesis is the process by which plants use sunlight, carbon dioxide, and water to produce glucose and oxygen.',
  },
  {
    id: 'q2',
    prompt: 'What is the main product of photosynthesis used for plant growth?',
    options: ['Oxygen', 'Glucose', 'Nitrogen', 'Sunlight'],
    correctAnswer: 'Glucose',
    explanation:
      'Glucose is the sugar produced during photosynthesis and acts as the plant’s stored chemical energy.',
  },
  {
    id: 'q3',
    prompt: 'What gas do plants absorb during photosynthesis?',
    options: ['Hydrogen', 'Carbon dioxide', 'Oxygen', 'Helium'],
    correctAnswer: 'Carbon dioxide',
    explanation:
      'Plants take in carbon dioxide from the atmosphere through tiny pores in their leaves during photosynthesis.',
  },
];

export default function PracticePage() {
  const [questions] = useState<Question[]>(sampleQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Adaptive Practice</p>
            <h1 className="text-3xl font-bold mt-2">Quick Quiz</h1>
          </div>
          <div className="px-4 py-2 rounded-full border border-purple-500/30 bg-purple-900/20 text-sm text-purple-200">
            Score: {score}/{questions.length}
          </div>
        </div>

        <div className="bg-black/20 border border-purple-500/10 rounded-2xl p-8">
          <div className="mb-6 text-sm text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </div>

          <h2 className="text-2xl font-semibold mb-6">{currentQuestion.prompt}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isSelected = option === selectedAnswer;

              let classes =
                'w-full text-left p-4 rounded-xl border transition ' +
                'border-purple-500/20 bg-purple-900/10 hover:border-purple-500/40';

              if (showExplanation && isCorrect) {
                classes += ' border-green-500/60 bg-green-500/10 text-green-200';
              }

              if (showExplanation && isSelected && !isCorrect) {
                classes += ' border-red-500/60 bg-red-500/10 text-red-200';
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={showExplanation}
                  className={classes}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-8 p-5 rounded-xl bg-slate-900 border border-purple-500/10">
              <div className="font-semibold text-green-400 mb-2">Explanation</div>
              <p className="text-gray-200">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold"
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Restart Quiz'}
            </button>
            <div className="text-sm text-gray-400">Adaptive review is enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
