import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizQuestion, Language } from '../types';
import { QUIZ_DATABASE } from '../lib/quizDatabase';
import { playSuccessDing, playBubblePop, playWhoosh, playTrophyCelebration } from '../lib/soundEffects';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  GraduationCap,
  BookOpen,
  School,
  Building2,
  Award,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface QuizPracticeViewProps {
  lang: Language;
  onSolveInVisualizer: (problemInput: string) => void;
}

type CategoryFilter = 'all' | 'fraction' | 'order-of-operations' | 'equation' | 'physics';
type LevelFilter = 'all' | 'school' | 'lyceum' | 'college' | 'university';

export const QuizPracticeView: React.FC<QuizPracticeViewProps> = ({
  lang,
  onSolveInVisualizer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('all');
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [score, setScore] = useState<number>(0);

  const isUz = lang.startsWith('uz');

  const filteredQuestions = QUIZ_DATABASE.filter((q) => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (selectedLevel !== 'all' && q.level !== selectedLevel) return false;
    return true;
  });

  const handleSelectOption = (questionId: string, optionId: string, isCorrect: boolean) => {
    if (answers[questionId]) return; // already answered

    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSuccessDing();
    } else {
      playBubblePop();
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setScore(0);
    playWhoosh();
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = filteredQuestions.length;
  const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Title & Score Statistics */}
      <div className="bg-gradient-to-r from-[#0056E0] via-blue-700 to-indigo-800 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-blue-950 shadow-xs">
                {isUz ? 'Interaktiv Test & Mashq' : 'Interactive Quiz & Test'}
              </span>
              <span className="text-blue-200 text-xs font-bold">
                {filteredQuestions.length} {isUz ? 'ta savol' : 'questions'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white">
              {isUz ? 'Kasrlar, Amallar Tartibi va Fizika Testlari' : 'Fractions, Order of Operations & Physics Quizzes'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              {isUz
                ? 'Har bir savol uchun variantni tanlang va 5 sekundlik animatsiyali to‘liq tushuntirishni oching!'
                : 'Select options and launch the 5-second animated step-by-step visualizer for any problem!'}
            </p>
          </div>

          {/* Score Counter Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-center shrink-0 self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-center items-center gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 block">
                {isUz ? 'To‘plangan ball' : 'Current Score'}
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-yellow-400">
                {score} / {answeredCount}
              </div>
            </div>

            <button
              onClick={handleResetQuiz}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isUz ? 'Testni qaytadan boshlash' : 'Reset test'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isUz ? 'Qayta' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-4 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-200">
            <span>{isUz ? 'Bajarilish holati' : 'Progress'}</span>
            <span>{answeredCount} / {totalCount} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-blue-950/60 overflow-hidden">
            <motion.div
              className="h-full bg-yellow-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs: Category & Level */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', labelUz: 'Barchasi', labelEn: 'All' },
            { id: 'fraction', labelUz: '🧮 Kasrlar', labelEn: '🧮 Fractions' },
            { id: 'order-of-operations', labelUz: '🔢 Amallar tartibi', labelEn: '🔢 PEMDAS' },
            { id: 'equation', labelUz: '📐 Tenglamalar', labelEn: '📐 Equations' },
            { id: 'physics', labelUz: '⚡ Fizika', labelEn: '⚡ Physics' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0056E0] text-white shadow-xs'
                  : 'bg-white dark:bg-[#0B1533] text-slate-700 dark:text-blue-200 border border-blue-100 dark:border-blue-900 hover:border-blue-300'
              }`}
            >
              {isUz ? cat.labelUz : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', labelUz: 'Barcha daraja', labelEn: 'All levels' },
            { id: 'school', labelUz: 'Maktab', labelEn: 'School' },
            { id: 'lyceum', labelUz: 'Litsey', labelEn: 'Lyceum' },
            { id: 'college', labelUz: 'Kollej', labelEn: 'College' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id as LevelFilter)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedLevel === lvl.id
                  ? 'bg-yellow-400 text-blue-950 font-bold shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-slate-600 dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              {isUz ? lvl.labelUz : lvl.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.map((q, qIdx) => {
          const userAnswer = answers[q.id];
          const isAnswered = !!userAnswer;
          const questionText =
            lang === 'uz-latn'
              ? q.questionUzLatn
              : lang === 'uz-cyrl'
              ? q.questionUzCyrl
              : lang === 'ru'
              ? q.questionRu
              : q.questionEn;

          const explanationText =
            lang === 'uz-latn'
              ? q.explanationUzLatn
              : lang === 'uz-cyrl'
              ? q.explanationUzCyrl
              : lang === 'ru'
              ? q.explanationRu
              : q.explanationEn;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIdx * 0.05 }}
              className="bg-white dark:bg-[#0B1533] border-2 border-blue-100 dark:border-blue-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Question Header: Number & Category Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-blue-50 dark:border-blue-950 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900 text-[#0056E0] dark:text-yellow-400 flex items-center justify-center font-black text-xs">
                      {qIdx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-blue-300">
                      {q.category} · {q.level}
                    </span>
                  </div>

                  {/* Math Input preview */}
                  <span className="font-mono text-xs font-bold text-[#0056E0] dark:text-yellow-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
                    {q.problemInput}
                  </span>
                </div>

                {/* Question Title */}
                <h3 className="text-sm sm:text-base font-bold text-blue-950 dark:text-white leading-snug">
                  {questionText}
                </h3>

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.id;
                    const showCorrect = isAnswered && opt.isCorrect;
                    const showWrong = isSelected && !opt.isCorrect;

                    return (
                      <button
                        key={opt.id}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, opt.id, opt.isCorrect)}
                        className={`w-full text-left p-3 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          showCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs'
                            : showWrong
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200'
                            : isAnswered
                            ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                            : 'bg-white dark:bg-[#070D1F] border-blue-100 dark:border-blue-900/80 text-slate-700 dark:text-blue-100 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                      >
                        <span>{opt.text}</span>
                        {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        {showWrong && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Drawer after answering */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-slate-700 dark:text-blue-200 leading-relaxed space-y-1"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[#0056E0] dark:text-yellow-400 text-[11px] uppercase tracking-wider">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isUz ? 'Tushuntirish va Qoida' : 'Explanation & Rule'}</span>
                    </div>
                    <p>{explanationText}</p>
                  </motion.div>
                )}
              </div>

              {/* Action Button: Solve in 5-second Animated Visualizer */}
              <div className="pt-3 border-t border-blue-50 dark:border-blue-950">
                <button
                  onClick={() => onSolveInVisualizer(q.problemInput)}
                  className="w-full py-2 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-black text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isUz ? '5 sekundlik animatsiyada ko‘rish' : 'Watch 5s Animated Breakdown'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
