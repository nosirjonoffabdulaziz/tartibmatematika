import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SolutionStep, Language } from '../types';
import { MathView } from './MathView';
import { Check, Copy, Volume2, ChevronDown, ChevronUp } from 'lucide-react';

interface StepCardProps {
  step: SolutionStep;
  lang: Language;
  index: number;
}

export const StepCard: React.FC<StepCardProps> = ({ step, lang, index }) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // Pick title & explanation according to language
  const title =
    lang === 'uz-latn'
      ? step.titleUzLatn
      : lang === 'uz-cyrl'
      ? step.titleUzCyrl
      : lang === 'ru'
      ? step.titleRu
      : step.titleEn;

  const explanation =
    lang === 'uz-latn'
      ? step.explanationUzLatn
      : lang === 'uz-cyrl'
      ? step.explanationUzCyrl
      : lang === 'ru'
      ? step.explanationRu
      : step.explanationEn;

  // Stage badge color mapping (Blue, Yellow, White palette)
  const stageBadges: Record<
    string,
    { label: string; bg: string; text: string; border: string }
  > = {
    understand: {
      label: lang.startsWith('uz') ? 'Masala mohiyati' : lang === 'ru' ? 'Понимание' : 'Understand',
      bg: 'bg-blue-100 dark:bg-blue-950/80',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-800',
    },
    given: {
      label: lang.startsWith('uz') ? 'Berilgan' : lang === 'ru' ? 'Дано' : 'Given',
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-[#0056E0] dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
    find: {
      label: lang.startsWith('uz') ? 'Topiş kerak' : lang === 'ru' ? 'Найти' : 'Find',
      bg: 'bg-yellow-100 dark:bg-yellow-950/50',
      text: 'text-yellow-800 dark:text-yellow-400',
      border: 'border-yellow-300 dark:border-yellow-800/80',
    },
    formula: {
      label: lang.startsWith('uz') ? 'Asosiy formula' : lang === 'ru' ? 'Формула' : 'Formula',
      bg: 'bg-blue-600 text-white',
      text: 'text-white',
      border: 'border-blue-700',
    },
    rearrange: {
      label: lang.startsWith('uz') ? 'Keltirib çiqariş' : lang === 'ru' ? 'Вывод формулы' : 'Rearrange',
      bg: 'bg-amber-100 dark:bg-amber-950/60',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-800',
    },
    substitute: {
      label: lang.startsWith('uz') ? 'Qöyib hisoblaş' : lang === 'ru' ? 'Подстановка' : 'Substitute',
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
    calculate: {
      label: lang.startsWith('uz') ? 'Hisoblaş' : lang === 'ru' ? 'Вычисление' : 'Calculation',
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      text: 'text-blue-900 dark:text-blue-200',
      border: 'border-blue-300 dark:border-blue-700',
    },
    verify: {
      label: lang.startsWith('uz') ? 'Tekşiriş' : lang === 'ru' ? 'Проверка' : 'Verify',
      bg: 'bg-yellow-50 dark:bg-yellow-950/40',
      text: 'text-yellow-700 dark:text-yellow-400',
      border: 'border-yellow-300 dark:border-yellow-700',
    },
    answer: {
      label: lang.startsWith('uz') ? 'Yaquniy javob' : lang === 'ru' ? 'Ответ' : 'Answer',
      bg: 'bg-yellow-400 text-blue-950',
      text: 'text-blue-950 font-bold',
      border: 'border-yellow-500',
    },
  };

  const badge = stageBadges[step.stage] || stageBadges.calculate;

  const handleCopy = () => {
    const textToCopy = `${title}\n${explanation}\n${step.latex || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(explanation);
    // Select speech language
    if (lang === 'ru') utterance.lang = 'ru-RU';
    else if (lang === 'en') utterance.lang = 'en-US';
    else utterance.lang = 'uz-UZ';

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      id={`step-card-${step.stepNumber}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.15,
        duration: 0.4,
        ease: 'easeOut',
      }}
      className="bg-white dark:bg-[#0B1533] border border-blue-100 dark:border-blue-900/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
    >
      {/* Top Header of Step */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Step Number Circle */}
          <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0056E0] dark:text-yellow-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
            {step.stepNumber}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
                {badge.label}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-blue-950 dark:text-white">
                {title}
              </h4>
            </div>
          </div>
        </div>

        {/* Action Buttons: Audio, Copy, Collapse */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePlayAudio}
            title={lang.startsWith('uz') ? 'Ovozli tushuntirish' : 'Audio explanation'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isPlayingAudio
                ? 'bg-yellow-400 text-blue-950 border-yellow-500 font-bold'
                : 'text-slate-400 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/50 border-transparent'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            title={lang.startsWith('uz') ? 'Qadamni nusxalash' : 'Copy step'}
            className="p-1.5 text-slate-400 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-slate-400 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body: Explanation & LaTeX */}
      {expanded && (
        <div className="mt-3.5 space-y-3 pl-0 sm:pl-9">
          <p className="text-sm text-slate-700 dark:text-blue-100 leading-relaxed font-sans font-normal">
            {explanation}
          </p>

          {step.latex && (
            <div className="bg-blue-50/60 dark:bg-[#070D1F] border border-blue-100 dark:border-blue-900/70 rounded-xl p-3 sm:p-4 overflow-x-auto flex items-center justify-center text-[#0056E0] dark:text-yellow-300 shadow-inner">
              <MathView latex={step.latex} displayMode={true} />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
