import React from 'react';
import { GivenFindSection, Language } from '../types';
import { MathView } from './MathView';
import { ArrowRight, HelpCircle } from 'lucide-react';

interface GivenFindPanelProps {
  data: GivenFindSection;
  lang: Language;
  onOpenWhyFormula?: () => void;
}

export const GivenFindPanel: React.FC<GivenFindPanelProps> = ({
  data,
  lang,
  onOpenWhyFormula,
}) => {
  const givenTitle = lang.startsWith('uz') ? 'Berilgan (Given)' : lang === 'ru' ? 'Дано' : 'Given';
  const findTitle = lang.startsWith('uz') ? 'Topiş kerak (Find)' : lang === 'ru' ? 'Найти' : 'Find';
  const formulaTitle = lang.startsWith('uz') ? 'Qöllanuvçi formula' : lang === 'ru' ? 'Формула' : 'Formula';

  return (
    <div className="bg-white dark:bg-[#0B1533] border border-blue-100 dark:border-blue-900/60 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 transition-colors duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Berilgan / Given */}
        <div className="bg-blue-50/50 dark:bg-[#070D1F] border border-blue-100 dark:border-blue-900/60 rounded-xl p-3.5 space-y-2">
          <div className="text-xs font-bold text-[#0056E0] dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0056E0]"></span>
            <span>{givenTitle}</span>
          </div>

          <div className="space-y-1.5">
            {data.given.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-blue-100 dark:border-blue-900/40 last:border-none">
                <span className="text-slate-700 dark:text-blue-100 font-sans text-xs sm:text-sm font-medium">{item.label}</span>
                <span className="font-mono text-[#0056E0] dark:text-blue-300 font-bold text-xs sm:text-sm">
                  {item.symbol} = {item.value} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Topish kerak / Find */}
        <div className="bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-200/60 dark:border-yellow-900/50 rounded-xl p-3.5 space-y-2">
          <div className="text-xs font-bold text-yellow-800 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span>{findTitle}</span>
          </div>

          <div className="space-y-1.5">
            {data.find.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-yellow-100 dark:border-yellow-900/40 last:border-none">
                <span className="text-slate-700 dark:text-yellow-100 font-sans text-xs sm:text-sm font-medium">{item.label}</span>
                <span className="font-mono text-yellow-700 dark:text-yellow-400 font-bold text-xs sm:text-sm">
                  {item.symbol} = ? {item.unit ? `[${item.unit}]` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formula & Rearrangement row */}
      {(data.primaryFormula || data.rearrangedFormula) && (
        <div className="bg-blue-50/30 dark:bg-[#070D1F]/60 border border-blue-100 dark:border-blue-900/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-600 dark:text-blue-300">{formulaTitle}:</span>
            {data.primaryFormula && (
              <span className="text-[#0056E0] dark:text-blue-200 font-mono text-sm px-2.5 py-1 bg-white dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-lg shadow-xs">
                <MathView latex={data.primaryFormula} />
              </span>
            )}
            {data.rearrangedFormula && (
              <>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-yellow-700 dark:text-yellow-300 font-mono text-sm px-2.5 py-1 bg-white dark:bg-blue-950/80 border border-yellow-300 dark:border-yellow-900/80 rounded-lg shadow-xs">
                  <MathView latex={data.rearrangedFormula} />
                </span>
              </>
            )}
          </div>

          {onOpenWhyFormula && (
            <button
              onClick={onOpenWhyFormula}
              className="text-xs font-bold text-[#0056E0] dark:text-yellow-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{lang.startsWith('uz') ? 'Nega aynan şu formula?' : 'Why this formula?'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
