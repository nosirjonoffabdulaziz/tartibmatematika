import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { OrderOfOperationsBreakdown, Language } from '../types';
import {
  playWhoosh,
  playBubblePop,
  playSuccessDing,
  playCountdownTick,
  playCalculationPulse,
  playTrophyCelebration,
} from '../lib/soundEffects';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  HelpCircle,
  Volume2,
  VolumeX,
  Radio,
  Share2,
  Check,
  Flame,
} from 'lucide-react';

interface OrderOfOperationsVisualizerProps {
  data: OrderOfOperationsBreakdown;
  lang: Language;
}

export const OrderOfOperationsVisualizer: React.FC<OrderOfOperationsVisualizerProps> = ({
  data,
  lang,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [stepDuration, setStepDuration] = useState<number>(5000); // 5 seconds default
  const [timeLeftMs, setTimeLeftMs] = useState<number>(5000);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [audioWaveActive, setAudioWaveActive] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const steps = data.steps;
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];

  const timerRef = useRef<any>(null);
  const lastSecondRef = useRef<number>(5);
  const isUz = lang.startsWith('uz');

  // Trigger sound effect whenever step changes (Whoosh + Bubble Pop)
  useEffect(() => {
    if (!currentStep) return;

    if (soundEnabled && !isFinished) {
      playWhoosh();
      setTimeout(() => {
        playBubblePop();
      }, 120);
      setAudioWaveActive(true);
    }
  }, [currentStepIndex, soundEnabled, isFinished]);

  // 5-second countdown timer with rhythmic audio tick & completion chime
  useEffect(() => {
    if (!isPlaying || isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 50;
    lastSecondRef.current = Math.ceil(timeLeftMs / 1000);

    timerRef.current = setInterval(() => {
      setTimeLeftMs((prev) => {
        // Check if second ticked for metronome tick
        const currentSec = Math.ceil(prev / 1000);
        if (currentSec !== lastSecondRef.current && currentSec > 0) {
          lastSecondRef.current = currentSec;
          if (soundEnabled) {
            playCountdownTick();
          }
        }

        if (prev <= intervalMs) {
          // Play success ding on completing this step
          if (soundEnabled) {
            playCalculationPulse();
            playSuccessDing();
          }

          // Advance to next step
          if (currentStepIndex < totalSteps - 1) {
            setCurrentStepIndex((idx) => idx + 1);
            return stepDuration;
          } else {
            // Reached the end! Final celebration
            setIsFinished(true);
            setIsPlaying(false);
            if (soundEnabled) {
              playTrophyCelebration();
            }
            try {
              confetti({
                particleCount: 80,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#0056E0', '#FACC15', '#10B981', '#38BDF8'],
              });
            } catch {}
            return 0;
          }
        }
        return prev - intervalMs;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, totalSteps, stepDuration, isFinished, soundEnabled, timeLeftMs]);

  const handleSelectStep = (idx: number) => {
    setCurrentStepIndex(idx);
    setTimeLeftMs(stepDuration);
    if (idx < totalSteps - 1) {
      setIsFinished(false);
    }
    if (soundEnabled) {
      playBubblePop();
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setTimeLeftMs(stepDuration);
    setIsFinished(false);
    setIsPlaying(true);
    if (soundEnabled) {
      playWhoosh();
    }
  };

  const handleTogglePlay = () => {
    if (isFinished) {
      handleRestart();
    } else {
      setIsPlaying(!isPlaying);
      if (soundEnabled) {
        playBubblePop();
      }
    }
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setTimeLeftMs(stepDuration);
      if (soundEnabled) playWhoosh();
    } else {
      setIsFinished(true);
      setIsPlaying(false);
      if (soundEnabled) playTrophyCelebration();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setTimeLeftMs(stepDuration);
      setIsFinished(false);
      if (soundEnabled) playWhoosh();
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playSuccessDing();
    }
  };

  const handleCopySummary = () => {
    const text = `${data.formattedDisplay} = ${data.finalAnswer}\n\n` +
      data.steps.map(s => `${s.orderNumber}-amal: ${s.subExpression} = ${s.subResult}`).join('\n');
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    if (soundEnabled) playBubblePop();
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeftMs / stepDuration) * 100));
  const secondsDisplay = (timeLeftMs / 1000).toFixed(1);

  const stepTitle =
    lang === 'uz-latn'
      ? currentStep?.titleUzLatn
      : lang === 'uz-cyrl'
      ? currentStep?.titleUzCyrl
      : lang === 'ru'
      ? currentStep?.titleRu
      : currentStep?.titleEn;

  const ruleExplanation =
    lang === 'uz-latn'
      ? currentStep?.ruleExplanationUzLatn
      : lang === 'uz-cyrl'
      ? currentStep?.ruleExplanationUzCyrl
      : lang === 'ru'
      ? currentStep?.ruleExplanationRu
      : currentStep?.ruleExplanationEn;

  return (
    <div
      id="order-of-operations-visualizer"
      className="bg-white dark:bg-[#0B1533] border-2 border-blue-200 dark:border-blue-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-7 shadow-lg space-y-4 sm:space-y-6 relative overflow-hidden transition-colors duration-200"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 dark:bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header: Title, Sound Effect Status & Playback Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-100 dark:border-blue-900/60 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-yellow-400/20 border border-yellow-400/50 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold text-base sm:text-lg shrink-0 shadow-xs">
            <Zap className="w-5 h-5 fill-current animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base md:text-lg font-black text-blue-950 dark:text-white">
                {isUz ? 'Amallar Bajarilish Tartibi' : 'Order of Operations'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-blue-950 shadow-xs">
                5s {isUz ? 'animatsiya' : 'animation'}
              </span>

              {/* Animated Soundwave Equalizer Pill */}
              <div
                onClick={toggleSound}
                className={`cursor-pointer px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border transition-all ${
                  soundEnabled
                    ? 'bg-blue-50 dark:bg-blue-950 text-[#0056E0] dark:text-yellow-400 border-blue-200 dark:border-blue-800'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
                title={soundEnabled ? 'Ovoz effektlarini o‘chirish' : 'Ovoz effektlarini yoqish'}
              >
                {soundEnabled ? (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-[#0056E0] dark:bg-yellow-400 rounded-full animate-bounce [animation-delay:0ms] h-2" />
                    <span className="w-0.5 bg-[#0056E0] dark:bg-yellow-400 rounded-full animate-bounce [animation-delay:150ms] h-3" />
                    <span className="w-0.5 bg-[#0056E0] dark:bg-yellow-400 rounded-full animate-bounce [animation-delay:300ms] h-1.5" />
                    <span className="w-0.5 bg-[#0056E0] dark:bg-yellow-400 rounded-full animate-bounce [animation-delay:75ms] h-2.5" />
                  </div>
                ) : (
                  <VolumeX className="w-3 h-3 text-slate-400" />
                )}
                <span>{soundEnabled ? (isUz ? 'SFX Ovoz Effekti' : 'SFX Active') : (isUz ? 'Ovozsiz' : 'Muted')}</span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-blue-300 line-clamp-1">
              {isUz
                ? 'Tartib raqami, animatsiyali strelka va sinxron ovoz effektlari bilan'
                : 'Numbered sequence, animated arrows and synchronized sound effects'}
            </p>
          </div>
        </div>

        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-stretch sm:self-auto justify-between sm:justify-end flex-wrap">
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className={`p-1.5 sm:p-2 rounded-xl text-xs font-bold border transition-all ${
              soundEnabled
                ? 'bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 border-yellow-400/40'
                : 'bg-blue-50 dark:bg-blue-950/80 text-slate-400 border-blue-200 dark:border-blue-800'
            }`}
            title={soundEnabled ? 'Ovoz effektlarini o‘chirish' : 'Ovoz effektlarini yoqish'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Speed Selector (3s / 5s / 8s) */}
          <div className="flex items-center bg-blue-50 dark:bg-blue-950/80 rounded-xl p-0.5 sm:p-1 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
            {[3000, 5000, 8000].map((ms) => (
              <button
                key={ms}
                onClick={() => {
                  setStepDuration(ms);
                  setTimeLeftMs(ms);
                  if (soundEnabled) playBubblePop();
                }}
                className={`px-1.5 sm:px-2 py-1 rounded-lg text-[11px] sm:text-xs transition-colors ${
                  stepDuration === ms
                    ? 'bg-[#0056E0] text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-blue-300'
                }`}
              >
                {ms / 1000}s
              </button>
            ))}
          </div>

          {/* Step Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 disabled:opacity-30 text-blue-950 dark:text-white border border-blue-200 dark:border-blue-800 transition-colors shadow-xs"
              title={isUz ? 'Oldingi amal' : 'Previous step'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1 px-3 py-1.5 sm:py-2 rounded-xl bg-[#0056E0] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              {isFinished ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isUz ? 'Qaytadan' : 'Replay'}</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>{isUz ? 'Pauza' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isUz ? 'Davom' : 'Play'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={isFinished}
              className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 disabled:opacity-30 text-blue-950 dark:text-white border border-blue-200 dark:border-blue-800 transition-colors shadow-xs"
              title={isUz ? 'Keyingi amal' : 'Next step'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-950 dark:text-white border border-blue-200 dark:border-blue-800 transition-colors shadow-xs"
              title={isUz ? 'Boshidan boshlash' : 'Restart'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. TEPADA UZUN MISOL VA TARTIB RAQAMI (Chalkboard Expression Stage) */}
      <div className="bg-[#080F26] text-white border-2 border-blue-400/40 dark:border-blue-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-inner relative overflow-hidden">
        {/* Academic geometric grid accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="flex items-center justify-between text-[11px] sm:text-xs text-blue-300 font-bold uppercase tracking-wider mb-2">
          <span>{isUz ? 'Berilgan uzun ifoda:' : 'Given expression:'}</span>
          <span className="flex items-center gap-1.5 text-yellow-400 font-black">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{isUz ? 'Tartib raqamlari (1, 2, 3...)' : 'Order of operations'}</span>
          </span>
        </div>

        {/* Expression tokens & badges with interactive selection */}
        <div className="py-2 sm:py-3 overflow-x-auto no-scrollbar flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2.5 font-mono text-base sm:text-xl md:text-2xl font-black text-white tracking-wide flex-wrap justify-center">
            {data.steps.map((step, idx) => {
              const isActive = idx === currentStepIndex && !isFinished;
              const isPassed = idx < currentStepIndex || isFinished;

              return (
                <motion.div
                  key={`step-token-${step.orderNumber}`}
                  onClick={() => handleSelectStep(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative cursor-pointer transition-all duration-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl flex items-center gap-1.5 sm:gap-2 select-none ${
                    isActive
                      ? 'bg-yellow-400 text-blue-950 font-black shadow-lg shadow-yellow-400/30 ring-4 ring-yellow-400/50 scale-105 sm:scale-110 z-10'
                      : isPassed
                      ? 'bg-blue-900/80 text-yellow-300 border border-blue-600'
                      : 'bg-blue-950/60 text-blue-200 border border-blue-800/80 hover:border-blue-500'
                  }`}
                >
                  {/* Order Circle Badge */}
                  <span
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shadow-xs shrink-0 ${
                      isActive
                        ? 'bg-blue-950 text-white animate-bounce'
                        : isPassed
                        ? 'bg-[#0056E0] text-white'
                        : 'bg-blue-800 text-blue-200'
                    }`}
                  >
                    {step.orderNumber}
                  </span>

                  {/* Sub-expression text */}
                  <span className="text-sm sm:text-base md:text-lg whitespace-nowrap">
                    {step.subExpression}
                  </span>

                  {/* Completion checkmark */}
                  {isPassed && !isActive && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 5-second countdown progress bar with live millisecond timing */}
        <div className="space-y-1.5 pt-3 border-t border-blue-900/60">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-blue-200 px-1">
            <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>
                {isFinished
                  ? (isUz ? 'Barcha amallar bajarildi!' : 'All steps completed!')
                  : isUz
                  ? `${currentStep?.orderNumber}-amal hisoblanmoqda (${secondsDisplay}s)`
                  : `Evaluating Step ${currentStep?.orderNumber} (${secondsDisplay}s)`}
              </span>
            </span>

            <span className="font-mono font-bold text-xs text-blue-300">
              {currentStepIndex + 1} / {totalSteps} {isUz ? 'amal' : 'steps'}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-blue-950 overflow-hidden border border-blue-800 p-0.5">
            <motion.div
              className={`h-full rounded-full transition-all duration-75 ${
                isFinished
                  ? 'bg-emerald-400'
                  : 'bg-gradient-to-r from-[#0056E0] via-yellow-400 to-yellow-500'
              }`}
              style={{
                width: isFinished ? '100%' : `${100 - progressPercent}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. ANIMATSIYALI HARAKATLANUVCHI STRELKA (Animated Downward Arrow with Sound Effect Visualizer) */}
      {!isFinished && (
        <div className="flex flex-col items-center justify-center -my-1 sm:-my-2 relative z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <div className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-yellow-400 text-blue-950 font-black text-[11px] sm:text-xs shadow-md border-2 border-white dark:border-[#0B1533] flex items-center gap-1.5">
              <span>{isUz ? `${currentStep?.orderNumber}-amal hisobi:` : `Step ${currentStep?.orderNumber}:`}</span>
              <span className="font-mono bg-blue-950 text-white px-1.5 py-0.2 rounded-md">
                {currentStep?.subExpression}
              </span>
            </div>
            <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 dark:text-yellow-400 drop-shadow-md stroke-[3]" />
          </motion.div>
        </div>
      )}

      {/* 4. AKTIV AMALNING TO‘LIQ TUSHUNTIRISH VA HISOBLASH DOSKASI */}
      <AnimatePresence mode="wait">
        {!isFinished && currentStep && (
          <motion.div
            key={`step-detail-${currentStep.orderNumber}`}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-[#070D1F] border-2 border-[#0056E0] dark:border-yellow-400/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md space-y-3 sm:space-y-4"
          >
            {/* Step Header: Order Badge + Title + Sub-Result */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-blue-100 dark:border-blue-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#0056E0] text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-xs shrink-0">
                  {currentStep.orderNumber}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-blue-950 dark:text-white">
                  {stepTitle}
                </h4>
              </div>

              {/* Exact arithmetic calculation pill */}
              <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700/80 shadow-xs">
                {currentStep.subExpression} = {currentStep.subResult}
              </span>
            </div>

            {/* Clear Pedagogical Rule & Arithmetic Logic */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs sm:text-sm text-slate-700 dark:text-blue-100 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#0056E0] dark:text-yellow-400 uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{isUz ? 'Qoida va hisoblash mantig‘i' : 'Rule & Mathematical Logic'}</span>
              </div>
              <p className="font-medium">{ruleExplanation}</p>
            </div>

            {/* Expression Evolution: Old -> New Transformation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-blue-50/40 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 space-y-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider block">
                  {isUz ? 'Oldingi holati:' : 'Previous state:'}
                </span>
                <div className="font-mono text-xs sm:text-sm text-slate-700 dark:text-blue-200 break-all font-semibold">
                  {currentStep.previousExpression}
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  {isUz ? 'Ushbu amaldan keyingi yangilangan holat:' : 'Expression after step:'}
                </span>
                <div className="font-mono text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 break-all font-bold">
                  {currentStep.resultingExpression}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. OXIRIDA NATIJA CHIQISH (Celebratory Final Answer Card at the End) */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            key="final-result-card"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-gradient-to-r from-blue-50 via-yellow-50/40 to-blue-50 dark:from-[#0B1533] dark:via-[#0E1A40] dark:to-[#0B1533] border-3 border-yellow-400 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden"
          >
            {/* Festive star badge */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-yellow-400 text-blue-950 flex items-center justify-center mx-auto shadow-md shadow-yellow-400/40">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#0056E0] dark:text-yellow-400 bg-white dark:bg-blue-950 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 shadow-xs inline-block">
                {isUz ? 'Barcha amallar to‘liq bajarildi!' : 'All operations complete!'}
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-blue-950 dark:text-white">
                {isUz ? 'Yakuniy Natija' : 'Final Calculated Result'}
              </h3>
            </div>

            {/* Giant Answer Display */}
            <div className="py-1 sm:py-2">
              <span className="font-mono text-3xl sm:text-5xl md:text-6xl font-black text-[#0056E0] dark:text-yellow-400 tracking-tight drop-shadow-sm">
                = {data.finalAnswer}
              </span>
            </div>

            {/* Summary of all steps */}
            <div className="max-w-md mx-auto bg-white/90 dark:bg-[#070D1F]/90 border border-blue-200 dark:border-blue-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs text-slate-600 dark:text-blue-200 space-y-2 text-left shadow-xs">
              <span className="font-bold text-blue-950 dark:text-white block uppercase tracking-wider text-[10px] sm:text-[11px]">
                {isUz ? 'Bajarilgan amallar ketma-ketligi:' : 'Sequence of operations performed:'}
              </span>
              <div className="space-y-1.5 font-mono text-[11px] sm:text-xs">
                {data.steps.map((st) => (
                  <div key={`summary-${st.orderNumber}`} className="flex items-center justify-between border-b border-blue-50 dark:border-blue-950 pb-1 last:border-0 last:pb-0">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 text-[#0056E0] dark:text-yellow-400 flex items-center justify-center font-bold text-[10px]">
                        {st.orderNumber}
                      </span>
                      <span>{st.subExpression}</span>
                    </span>
                    <span className="font-bold text-[#0056E0] dark:text-yellow-400">
                      = {st.subResult}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Replay & Copy summary */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={handleRestart}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[#0056E0] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isUz ? 'Animatsiyani qaytadan ko‘rish' : 'Replay Animation'}</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="px-4 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-blue-950 text-blue-950 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900 font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? (isUz ? 'Nusxalandi!' : 'Copied!') : (isUz ? 'Nusxa olish' : 'Copy')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
