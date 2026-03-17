import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SYMBOLS } from '../lib/mockData';
import { SymbolImage } from './SymbolImage';
import { MilitarySymbol, Difficulty } from '../types';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface TrainerProps {
  difficulty: Difficulty;
  onClose: () => void;
}

export const Trainer: React.FC<TrainerProps> = ({ difficulty, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = useMemo(() => {
    // Filter symbols by difficulty. For 'basic', we show basic. For 'intermediate', we show intermediate. For 'advanced', we show advanced.
    const filtered = MOCK_SYMBOLS.filter(s => s.difficulty === difficulty);
    
    // If we don't have enough symbols for a specific difficulty, fallback to all (shouldn't happen with expanded data)
    const source = filtered.length >= 4 ? filtered : MOCK_SYMBOLS;
    
    const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, 10);
    
    return shuffled.map(correct => {
      const distractors: MilitarySymbol[] = [];
      const usedNames = new Set([correct.name]);
      
      // Shuffle all symbols to pick random distractors
      const pool = [...MOCK_SYMBOLS].sort(() => Math.random() - 0.5);
      
      for (const s of pool) {
        if (distractors.length >= 3) break;
        if (s.id !== correct.id && !usedNames.has(s.name)) {
          distractors.push(s);
          usedNames.add(s.name);
        }
      }
      
      const options = [...distractors, correct].sort(() => Math.random() - 0.5);
      
      return {
        correct,
        options
      };
    });
  }, [difficulty]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    if (optionId === currentQuestion.correct.id) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500 italic">Немає доступних питань для цього рівня складності.</p>
        <button onClick={onClose} className="mt-4 px-6 py-2 bg-[#5A5A40] text-white rounded-xl">Назад</button>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-2xl mx-auto"
      >
        <div className="w-24 h-24 bg-[#5A5A40] text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <Trophy className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-bold mb-4">Тренування завершено!</h2>
        <p className="text-xl text-gray-600 mb-8 italic">Ваш результат: <span className="text-[#5A5A40] font-bold">{score} з {questions.length}</span></p>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => {
              setCurrentQuestionIndex(0);
              setScore(0);
              setQuizFinished(false);
              setIsAnswered(false);
              setSelectedOptionId(null);
            }}
            className="flex items-center gap-2 px-8 py-4 bg-[#5A5A40] text-white rounded-2xl font-bold hover:bg-[#4a4a35] transition-all"
          >
            <RotateCcw className="w-5 h-5" /> Спробувати знову
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            До каталогу
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XCircle className="w-8 h-8" />
          </button>
          <h2 className="text-2xl font-bold text-[#5A5A40]">Тренажер: {
            difficulty === 'basic' ? 'Базовий' : 
            difficulty === 'intermediate' ? 'Середній' : 'Просунутий'
          }</h2>
        </div>
        <div className="text-lg font-bold text-gray-400">
          Питання {currentQuestionIndex + 1} з {questions.length}
        </div>
      </div>

      <div className="bg-white p-12 rounded-[40px] shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-12">
          <div className="bg-gray-50 p-8 rounded-3xl mb-8 shadow-inner">
            <SymbolImage sidc={currentQuestion.correct.sidc} size={120} />
          </div>
          <h3 className="text-3xl font-bold text-center">Оберіть правильну назву для цього символу:</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => {
            const isCorrect = option.id === currentQuestion.correct.id;
            const isSelected = option.id === selectedOptionId;
            
            let buttonClass = "p-6 rounded-2xl border-2 text-xl font-bold transition-all flex items-center justify-between ";
            if (!isAnswered) {
              buttonClass += "border-gray-100 hover:border-[#5A5A40] hover:bg-gray-50";
            } else {
              if (isCorrect) {
                buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
              } else if (isSelected) {
                buttonClass += "border-rose-500 bg-rose-50 text-rose-700";
              } else {
                buttonClass += "border-gray-100 opacity-50";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <span>{option.name}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-500" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex justify-end"
            >
              <button 
                onClick={nextQuestion}
                className="flex items-center gap-2 px-10 py-5 bg-[#5A5A40] text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Наступне питання' : 'Завершити'} 
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function Trophy({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
