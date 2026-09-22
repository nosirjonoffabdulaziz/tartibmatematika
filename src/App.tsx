import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Language, SolverResult, SolvedHistoryItem } from './types';
import { getTranslation } from './i18n/translations';
import { solveProblem } from './lib/solverMaster';
import { Header } from './components/Header';
import { MathKeyboard } from './components/MathKeyboard';
import { MathView } from './components/MathView';
import { StepCard } from './components/StepCard';
import { GivenFindPanel } from './components/GivenFindPanel';
import { VerificationBadge } from './components/VerificationBadge';
import { WhyThisFormulaModal } from './components/WhyThisFormulaModal';
import { FormulaLibrary } from './components/FormulaLibrary';
import { UnitConverterModal } from './components/UnitConverterModal';
import { PhysicsVisualizer } from './components/PhysicsVisualizer';
import { ImageOcrModal } from './components/ImageOcrModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { OrderOfOperationsVisualizer } from './components/OrderOfOperationsVisualizer';
import { QuizPracticeView } from './components/QuizPracticeView';
import {
  Sparkles,
  Keyboard,
  Printer,
  Share2,
  Check,
  AlertTriangle,
  RotateCcw,
  Zap,
  HelpCircle,
  Award,
} from 'lucide-react';

export default function App() {
  // 1. Theme state (light / dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ilmhub_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    localStorage.setItem('ilmhub_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Language state (default uz-latn)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('ilmhub_lang');
    return (saved as Language) || 'uz-latn';
  });

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // 3. Navigation state
  const [activeTab, setActiveTab] = useState<'solver' | 'formulas' | 'quiz' | 'converter' | 'visualizer'>('solver');


  // 4. Solver & Input state
  const [input, setInput] = useState<string>('24 + (18 - 6) * 3 - 40 / 5');
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SolverResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedAnswer, setCopiedAnswer] = useState<boolean>(false);

  // 5. Modals & Drawers state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isOcrOpen, setIsOcrOpen] = useState<boolean>(false);
  const [isWhyFormulaOpen, setIsWhyFormulaOpen] = useState<boolean>(false);
  const [historyItems, setHistoryItems] = useState<SolvedHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('ilmhub_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync language to localStorage
  useEffect(() => {
    localStorage.setItem('ilmhub_lang', lang);
  }, [lang]);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('ilmhub_history', JSON.stringify(historyItems));
  }, [historyItems]);

  // Load history from server on mount
  useEffect(() => {
    fetch('/api/history')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setHistoryItems((prev) => {
            const map = new Map<string, SolvedHistoryItem>();
            [...data, ...prev].forEach((item) => map.set(item.id, item));
            return Array.from(map.values()).slice(0, 50);
          });
        }
      })
      .catch(() => {});
  }, []);

  // Auto-solve default problem on initial mount
  useEffect(() => {
    handleSolve('24 + (18 - 6) * 3 - 40 / 5');
  }, []);

  // Quick preset problem chips (including long expressions with order of operations)
  const presets = [
    { label: '24 + (18 - 6) × 3 - 40 ÷ 5', input: '24 + (18 - 6) * 3 - 40 / 5', type: 'order-of-operations' },
    { label: '150 - (45 + 15) ÷ 3 × 2 + 18', input: '150 - (45 + 15) / 3 * 2 + 18', type: 'order-of-operations' },
    { label: '(36 - 12) ÷ 4 + 8 × (5 + 2)', input: '(36 - 12) / 4 + 8 * (5 + 2)', type: 'order-of-operations' },
    { label: 'x² - 5x + 6 = 0', input: 'x^2 - 5x + 6 = 0', type: 'quadratic' },
    { label: '3x + 7 = 25', input: '3x + 7 = 25', type: 'linear' },
    { label: '3/4 + 5/6', input: '3/4 + 5/6', type: 'fraction' },
    { label: 'm = 5 kg, F = 20 N, a = ?', input: 'm = 5 kg, F = 20 N, a = ?', type: 'physics' },
    { label: 'U = 12 V, R = 4 Ω, I = ?', input: 'U = 12 V, R = 4 ohm, I = ?', type: 'physics' },
    { label: '72 km/h -> m/s', input: '72 km/h', type: 'converter' },
  ];

  // Primary Solve Handler
  const handleSolve = async (problemToSolve?: string) => {
    const query = (problemToSolve !== undefined ? problemToSolve : input).trim();
    if (!query) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await solveProblem(query);

      if (res && res.success && res.steps.length > 0) {
        setResult(res);

        // Save to history
        const newHistItem: SolvedHistoryItem = {
          id: `hist-${Date.now()}`,
          input: query,
          subject: res.subject,
          problemType: res.problemType,
          answer: res.finalAnswerExact || res.finalAnswerLatex,
          verified: res.verified,
          timestamp: Date.now(),
        };

        setHistoryItems((prev) => [newHistItem, ...prev.filter((i) => i.input !== query)].slice(0, 50));

        // Fire festive educational confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b'],
          });
        } catch {
          // Ignore if confetti blocked
        }
      } else {
        setErrorMsg(
          res.errorMessage ||
            (lang.startsWith('uz')
              ? 'Ushbu ifodani avtomatik yechish imkoni boʻlmadi. Iltimos, belgilarni aniqroq yozing.'
              : 'Could not solve automatically. Please verify your syntax.')
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Virtual Keyboard Insert Helper
  const handleKeyboardInsert = (val: string) => {
    if (!inputRef.current) {
      setInput((prev) => prev + val);
      return;
    }
    const el = inputRef.current;
    const start = el.selectionStart || input.length;
    const end = el.selectionEnd || input.length;
    const nextVal = input.substring(0, start) + val + input.substring(end);
    setInput(nextVal);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + val.length, start + val.length);
    }, 10);
  };

  const handleKeyboardDelete = () => {
    if (!inputRef.current) {
      setInput((prev) => prev.slice(0, -1));
      return;
    }
    const el = inputRef.current;
    const start = el.selectionStart || input.length;
    const end = el.selectionEnd || input.length;

    if (start === end && start > 0) {
      const nextVal = input.substring(0, start - 1) + input.substring(end);
      setInput(nextVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start - 1, start - 1);
      }, 10);
    } else if (start !== end) {
      const nextVal = input.substring(0, start) + input.substring(end);
      setInput(nextVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start, start);
      }, 10);
    }
  };

  const handleKeyboardClear = () => {
    setInput('');
    inputRef.current?.focus();
  };

  // Copy final answer
  const handleCopyAnswer = () => {
    if (!result) return;
    const text = `${result.finalAnswerExact || result.finalAnswerLatex}`;
    navigator.clipboard.writeText(text);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  // Print solution
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#080F26] text-white' : 'bg-[#F4F7FC] text-blue-950'} flex flex-col font-sans selection:bg-yellow-400 selection:text-blue-950 transition-colors duration-200`}>
      {/* 1. Header Navigation */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenOcr={() => setIsOcrOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* 2. Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* TAB 1: SOLVER */}
        {activeTab === 'solver' && (
          <div className="space-y-6">
            {/* Input & Search Section */}
            <div className="bg-white dark:bg-[#0B1533] border border-blue-100 dark:border-blue-900/60 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <label htmlFor="problem-input" className="text-xs sm:text-sm font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0056E0] dark:text-yellow-400" />
                  <span>
                    {lang.startsWith('uz')
                      ? 'Matematika yoki fizika masalasini kiriting:'
                      : lang === 'ru'
                      ? 'Введите задачу по математике или физике:'
                      : 'Enter math or physics problem:'}
                  </span>
                </label>

                {/* Keyboard toggle button */}
                <button
                  id="btn-toggle-keyboard"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    showKeyboard
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-[#0056E0] dark:text-yellow-400 border-blue-300 dark:border-blue-700 shadow-xs'
                      : 'bg-blue-50/60 dark:bg-blue-950/80 text-slate-700 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white border-blue-200 dark:border-blue-800/80'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>{t('virtualKeyboard')}</span>
                </button>
              </div>

              {/* Input field with action buttons */}
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id="problem-input"
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSolve();
                    }}
                    placeholder={
                      lang.startsWith('uz')
                        ? 'Masalan: x² - 5x + 6 = 0 yoki m=5kg, F=20N, a=?'
                        : 'e.g. x^2 - 5x + 6 = 0 or m=5kg, F=20N, a=?'
                    }
                    className="w-full px-4 py-3.5 bg-blue-50/30 dark:bg-[#070D1F] border border-blue-200 dark:border-blue-800 focus:border-[#0056E0] dark:focus:border-yellow-400 rounded-2xl text-blue-950 dark:text-white font-mono text-base focus:outline-none transition-colors shadow-inner"
                  />
                  {input && (
                    <button
                      onClick={() => setInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-950 dark:hover:text-white text-xs px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  id="btn-solve-main"
                  onClick={() => handleSolve()}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3.5 rounded-2xl bg-[#0056E0] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all shrink-0 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>{lang.startsWith('uz') ? 'Yechilmoqda...' : 'Solving...'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{t('solve')}</span>
                    </span>
                  )}
                </button>
              </div>

              {/* Preset Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 no-scrollbar">
                <span className="text-[11px] font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider shrink-0 mr-1">
                  {lang.startsWith('uz') ? 'Namunalar:' : 'Samples:'}
                </span>
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setInput(p.input);
                      handleSolve(p.input);
                    }}
                    className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#0056E0] dark:text-yellow-300 border border-blue-200 dark:border-blue-800/80 whitespace-nowrap transition-colors shadow-xs"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Virtual Math Keyboard dropdown if toggled */}
              {showKeyboard && (
                <div className="pt-2 animate-fade-in">
                  <MathKeyboard
                    onInsert={handleKeyboardInsert}
                    onDelete={handleKeyboardDelete}
                    onClear={handleKeyboardClear}
                    onSubmit={() => handleSolve()}
                    lang={lang}
                  />
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm shadow-xs">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">{lang.startsWith('uz') ? 'Xatolik' : 'Error'}</span>
                  <p>{errorMsg}</p>
                </div>
              </div>
            )}

            {/* RESULTS VIEW */}
            <AnimatePresence mode="wait">
              {result && result.success && (
                <motion.div
                  key={`solution-${result.originalInput}-${result.finalAnswerExact || ''}`}
                  id="solution-container"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* 1. ORDER OF OPERATIONS 5-SECOND ANIMATED BREAKDOWN (When long expression with order of operations) */}
                  {result.orderOfOperations && (
                    <OrderOfOperationsVisualizer
                      data={result.orderOfOperations}
                      lang={lang}
                    />
                  )}

                  {/* Final Answer Banner */}
                  <div className="bg-white dark:bg-[#0B1533] border-2 border-blue-200 dark:border-blue-800 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden transition-colors duration-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-[#0056E0] dark:text-yellow-400 border border-blue-200 dark:border-blue-800">
                            {lang.startsWith('uz') ? 'Aniqlangan javob' : 'Final Answer'}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-blue-300 font-semibold">
                            {result.subject === 'physics' ? 'Fizika' : 'Matematika'} • {result.problemType}
                          </span>
                        </div>

                        <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0056E0] dark:text-yellow-400 tracking-tight flex items-center gap-3">
                          <MathView latex={result.finalAnswerLatex || result.finalAnswerExact} displayMode={false} />
                        </div>
                      </div>

                      {/* Action buttons on answer */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={handleCopyAnswer}
                          className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-950 dark:text-white rounded-xl text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-colors shadow-xs"
                        >
                          {copiedAnswer ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                          <span>{copiedAnswer ? (lang.startsWith('uz') ? 'Nusxalandi!' : 'Copied!') : (lang.startsWith('uz') ? 'Nusxa olish' : 'Copy')}</span>
                        </button>

                        <button
                          onClick={handlePrint}
                          className="p-2 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-950 dark:text-white rounded-xl border border-blue-200 dark:border-blue-800 transition-colors shadow-xs"
                          title={lang.startsWith('uz') ? 'Chop etish / PDF' : 'Print / Export PDF'}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Given-Find Section if available */}
                  {result.givenFind && (
                    <GivenFindPanel
                      data={result.givenFind}
                      lang={lang}
                      onOpenWhyFormula={result.whyThisFormula ? () => setIsWhyFormulaOpen(true) : undefined}
                    />
                  )}

                  {/* Step-by-Step Cards List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-sm font-bold text-blue-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span>{t('stepByStep')}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0056E0] dark:text-yellow-400 font-mono font-bold">
                          {result.steps.length} {lang.startsWith('uz') ? 'bosqich' : 'steps'}
                        </span>
                      </h3>

                      {result.whyThisFormula && (
                        <button
                          onClick={() => setIsWhyFormulaOpen(true)}
                          className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-1 font-semibold transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{lang.startsWith('uz') ? 'Nega aynan shu formula?' : 'Why this formula?'}</span>
                        </button>
                      )}
                    </div>

                    {result.steps.map((step, idx) => (
                      <motion.div
                        key={step.id || `step-${idx}-${step.stepNumber}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15, duration: 0.35, ease: 'easeOut' }}
                      >
                        <StepCard step={step} lang={lang} index={idx} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Verification Badge */}
                  {result.verified && (
                    <VerificationBadge result={result} lang={lang} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 2: FORMULA LIBRARY */}
        {activeTab === 'formulas' && (
          <FormulaLibrary
            lang={lang}
            onSelectProblem={(prob) => {
              setInput(prob);
              setActiveTab('solver');
              handleSolve(prob);
            }}
          />
        )}

        {/* TAB 3: QUIZ & TEST PRACTICE */}
        {activeTab === 'quiz' && (
          <QuizPracticeView
            lang={lang}
            onSolveInVisualizer={(prob) => {
              setInput(prob);
              setActiveTab('solver');
              handleSolve(prob);
            }}
          />
        )}

        {/* TAB 4: UNIT CONVERTER */}
        {activeTab === 'converter' && (
          <UnitConverterModal
            lang={lang}
            onInsertValue={(val) => {
              setInput((prev) => `${prev} ${val}`);
              setActiveTab('solver');
            }}
          />
        )}

        {/* TAB 4: VISUALIZER */}
        {activeTab === 'visualizer' && (
          <PhysicsVisualizer lang={lang} />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-blue-100 dark:border-blue-900/60 bg-white dark:bg-[#070D1F] py-5 text-center text-xs text-slate-500 dark:text-blue-300 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>IlmHub Math & Physics Educational Platform • Oʻzbekiston va Jahon taʼlim standartlari</span>
          <span className="font-mono text-[#0056E0] dark:text-yellow-400 font-bold">KaTeX + SI System + Gemini AI Thinking</span>
        </div>
      </footer>

      {/* 4. Overlays & Modals */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onSelectItem={(prob) => {
          setInput(prob);
          handleSolve(prob);
        }}
        onClearHistory={() => setHistoryItems([])}
        lang={lang}
      />

      {isOcrOpen && (
        <ImageOcrModal
          lang={lang}
          onClose={() => setIsOcrOpen(false)}
          onExtracted={(extracted) => {
            setInput(extracted);
            setActiveTab('solver');
            handleSolve(extracted);
          }}
        />
      )}

      {isWhyFormulaOpen && result && (
        <WhyThisFormulaModal
          result={result}
          lang={lang}
          onClose={() => setIsWhyFormulaOpen(false)}
        />
      )}
    </div>
  );
}
