import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SYMBOLS } from '../lib/mockData';
import { SymbolImage } from './SymbolImage';
import { MilitarySymbol, Difficulty } from '../types';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, ChevronLeft } from 'lucide-react';

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
        <p className="text-xl text-zinc-500 font-light italic">Немає доступних питань для цього рівня складності.</p>
        <button onClick={onClose} className="mt-8 px-8 py-3 bg-emerald-500 text-black font-bold rounded-lg uppercase tracking-widest text-xs">Назад</button>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="px-4 py-8 md:py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#141417] p-6 md:p-12 rounded-lg border border-zinc-800 text-center max-w-2xl mx-auto relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-emerald-500/20">
            <Trophy className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 uppercase tracking-tighter">Тренування завершено!</h2>
          <p className="text-lg md:text-xl text-zinc-400 mb-8 md:mb-12 font-light">Ваш результат: <span className="text-emerald-500 font-mono font-bold">{score} з {questions.length}</span></p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setCurrentQuestionIndex(0);
                setScore(0);
                setQuizFinished(false);
                setIsAnswered(false);
                setSelectedOptionId(null);
              }}
              className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-emerald-500 text-black rounded-lg font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-emerald-400 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Спробувати знову
            </button>
            <button 
              onClick={onClose}
              className="px-6 md:px-8 py-3 md:py-4 bg-zinc-800 text-zinc-300 rounded-lg font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-zinc-700 transition-all"
            >
              До каталогу
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 border-b border-zinc-800 pb-4 gap-4">
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-rose-500 transition-all group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Назад</span>
          </button>
          <div>
            <div className="text-emerald-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] mb-0.5">Active Simulation</div>
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight">Тренажер: {
              difficulty === 'basic' ? 'Базовий' : 
              difficulty === 'intermediate' ? 'Середній' : 'Просунутий'
            }</h2>
          </div>
        </div>
        <div className="flex items-center gap-4 md:text-right">
          <div className="hidden md:block">
            <div className="text-zinc-500 font-mono text-[10px] uppercase mb-0.5">Progress</div>
            <div className="text-sm font-mono font-bold text-zinc-300">
              {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>
          <div className="md:hidden flex-1 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="md:hidden text-[10px] font-mono font-bold text-zinc-500 whitespace-nowrap">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="bg-[#141417] p-3 md:p-6 rounded-lg border border-zinc-800 relative overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="absolute top-0 right-0 p-3 font-mono text-[8px] text-zinc-700 tracking-[0.2em] hidden sm:block">SECURE_LINK_ESTABLISHED</div>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-1 items-center md:items-stretch min-h-0">
          {/* Symbol Section */}
          <div className="w-full md:w-2/5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800/50 pb-4 md:pb-0 md:pr-8">
            <div className="bg-zinc-900 p-3 md:p-6 rounded-lg border border-zinc-800 mb-3 md:mb-4 shadow-inner group transition-all w-full aspect-square flex items-center justify-center max-w-[140px] md:max-w-[240px]">
              <div className="w-full h-full flex items-center justify-center">
                <SymbolImage sidc={currentQuestion.correct.sidc} size={120} />
              </div>
            </div>
            <h3 className="text-sm md:text-lg font-bold text-center uppercase tracking-tight">Ідентифікуйте символ:</h3>
          </div>

          {/* Options Section */}
          <div className="w-full md:w-3/5 flex flex-col justify-center py-2">
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              {currentQuestion.options.map((option) => {
                const isCorrect = option.id === currentQuestion.correct.id;
                const isSelected = option.id === selectedOptionId;
                
                let buttonClass = "p-3 md:p-4 rounded-lg border transition-all flex items-center justify-between group relative overflow-hidden ";
                if (!isAnswered) {
                  buttonClass += "border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/50 hover:bg-zinc-800 active:scale-[0.98]";
                } else {
                  if (isCorrect) {
                    buttonClass += "border-emerald-500 bg-emerald-500/10 text-emerald-500";
                  } else if (isSelected) {
                    buttonClass += "border-rose-500 bg-rose-500/10 text-rose-500";
                  } else {
                    buttonClass += "border-zinc-800 opacity-30";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={isAnswered}
                    className={buttonClass}
                  >
                    <span className="font-bold tracking-tight uppercase text-[11px] md:text-xs text-left flex-1 mr-2 leading-tight">{option.name}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="h-12 md:h-14 mt-4">
              <AnimatePresence>
                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-end h-full"
                  >
                    <button 
                      onClick={nextQuestion}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 md:px-8 bg-emerald-500 text-black rounded-lg font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Наступне питання' : 'Завершити'} 
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
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
