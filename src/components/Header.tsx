import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { BookOpen, Calculator, RefreshCw, History, Camera, Sparkles, Sun, Moon, Award } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: 'solver' | 'formulas' | 'quiz' | 'converter' | 'visualizer';
  onTabChange: (tab: 'solver' | 'formulas' | 'quiz' | 'converter' | 'visualizer') => void;
  onOpenHistory: () => void;
  onOpenOcr: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  activeTab,
  onTabChange,
  onOpenHistory,
  onOpenOcr,
  theme,
  onToggleTheme,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#080E24]/95 backdrop-blur-md border-b border-blue-100 dark:border-blue-900/60 text-slate-800 dark:text-slate-100 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onTabChange('solver')}>
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-blue-500/30 flex items-center justify-center shrink-0 bg-[#0056E0] group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="IlmHub Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-blue-950 dark:text-white">
                IlmHub <span className="text-[#0056E0] dark:text-yellow-400">Math</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-yellow-400 text-blue-950 rounded shadow-xs">
                AI + SI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-blue-300 hidden sm:block truncate max-w-xs font-medium">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-blue-50/80 dark:bg-[#0B1533] p-1 rounded-xl border border-blue-100 dark:border-blue-900/60">
          <button
            id="nav-tab-solver"
            onClick={() => onTabChange('solver')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'solver'
                ? 'bg-[#0056E0] text-white shadow-sm'
                : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-blue-900/40'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{t('tabSolve')}</span>
          </button>

          <button
            id="nav-tab-formulas"
            onClick={() => onTabChange('formulas')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'formulas'
                ? 'bg-[#0056E0] text-white shadow-sm'
                : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-blue-900/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('tabFormulas')}</span>
          </button>

          <button
            id="nav-tab-quiz"
            onClick={() => onTabChange('quiz')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-yellow-400 text-blue-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-blue-900/40'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
            <span>{t('tabQuiz')}</span>
          </button>

          <button
            id="nav-tab-converter"
            onClick={() => onTabChange('converter')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'converter'
                ? 'bg-[#0056E0] text-white shadow-sm'
                : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-blue-900/40'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('tabConverter')}</span>
          </button>

          <button
            id="nav-tab-visualizer"
            onClick={() => onTabChange('visualizer')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'visualizer'
                ? 'bg-[#0056E0] text-white shadow-sm'
                : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-blue-900/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>{t('tabVisualizer')}</span>
          </button>
        </nav>

        {/* Right Tools: Theme toggle, OCR, History, Language selector */}
        <div className="flex items-center gap-2">
          {/* Scan Photo Button */}
          <button
            id="btn-open-ocr"
            onClick={onOpenOcr}
            title={t('scanPhoto')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800 transition-colors shadow-xs"
          >
            <Camera className="w-4 h-4 text-[#0056E0] dark:text-yellow-400" />
            <span className="hidden sm:inline">{t('scanPhoto')}</span>
          </button>

          {/* History Button */}
          <button
            id="btn-open-history"
            onClick={onOpenHistory}
            title={t('history')}
            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800 transition-colors shadow-xs"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Light / Dark Mode Toggle Button */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Yorugʻ rejim (Light mode)' : 'Qorongʻu rejim (Dark mode)'}
            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/80 hover:bg-yellow-100 dark:hover:bg-blue-900 text-blue-900 dark:text-yellow-400 border border-blue-200 dark:border-blue-800 transition-all shadow-xs active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-yellow-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-[#0056E0]" />
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <select
              id="language-select"
              value={lang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-white dark:bg-[#070D1F] border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100 text-xs font-semibold rounded-lg px-2.5 py-1.5 appearance-none pr-7 focus:outline-none focus:border-[#0056E0] cursor-pointer shadow-xs"
            >
              <option value="uz-latn">Oʻzb (Lotin)</option>
              <option value="uz-cyrl">Ўзб (Кирилл)</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sub-tabs */}
      <div className="flex md:hidden border-t border-blue-100 dark:border-blue-900/60 bg-blue-50/90 dark:bg-[#0B1533]/90 px-1 py-1 justify-around text-[11px] overflow-x-auto no-scrollbar">
        <button
          onClick={() => onTabChange('solver')}
          className={`py-1 px-1.5 rounded font-semibold whitespace-nowrap ${activeTab === 'solver' ? 'text-[#0056E0] dark:text-yellow-400 font-bold' : 'text-slate-600 dark:text-blue-200'}`}
        >
          {t('tabSolve')}
        </button>
        <button
          onClick={() => onTabChange('formulas')}
          className={`py-1 px-1.5 rounded font-semibold whitespace-nowrap ${activeTab === 'formulas' ? 'text-[#0056E0] dark:text-yellow-400 font-bold' : 'text-slate-600 dark:text-blue-200'}`}
        >
          {t('tabFormulas')}
        </button>
        <button
          onClick={() => onTabChange('quiz')}
          className={`py-1 px-1.5 rounded font-bold whitespace-nowrap ${activeTab === 'quiz' ? 'bg-yellow-400 text-blue-950 px-2' : 'text-amber-600 dark:text-yellow-400'}`}
        >
          {t('tabQuiz')}
        </button>
        <button
          onClick={() => onTabChange('converter')}
          className={`py-1 px-1.5 rounded font-semibold whitespace-nowrap ${activeTab === 'converter' ? 'text-[#0056E0] dark:text-yellow-400 font-bold' : 'text-slate-600 dark:text-blue-200'}`}
        >
          {t('tabConverter')}
        </button>
        <button
          onClick={() => onTabChange('visualizer')}
          className={`py-1 px-1.5 rounded font-semibold whitespace-nowrap ${activeTab === 'visualizer' ? 'text-[#0056E0] dark:text-yellow-400 font-bold' : 'text-slate-600 dark:text-blue-200'}`}
        >
          {t('tabVisualizer')}
        </button>
      </div>
    </header>
  );
};

