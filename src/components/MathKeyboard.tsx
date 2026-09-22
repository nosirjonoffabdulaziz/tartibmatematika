import React, { useState } from 'react';
import { Delete, CornerDownLeft, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface MathKeyboardProps {
  onInsert: (text: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onSubmit: () => void;
  lang: Language;
}

export const MathKeyboard: React.FC<MathKeyboardProps> = ({
  onInsert,
  onDelete,
  onClear,
  onSubmit,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'algebra' | 'physics' | 'symbols'>('basic');

  const tabs = [
    { id: 'basic' as const, label: lang.startsWith('uz') ? 'Asosiy' : lang === 'ru' ? 'Основные' : 'Basic' },
    { id: 'algebra' as const, label: lang.startsWith('uz') ? 'Algebra' : lang === 'ru' ? 'Алгебра' : 'Algebra' },
    { id: 'physics' as const, label: lang.startsWith('uz') ? 'Fizika' : lang === 'ru' ? 'Физика' : 'Physics' },
    { id: 'symbols' as const, label: lang.startsWith('uz') ? 'Belgilar' : lang === 'ru' ? 'Символы' : 'Symbols' },
  ];

  const basicKeys = [
    ['7', '8', '9', '/', '(', ')'],
    ['4', '5', '6', '*', '+', '-'],
    ['1', '2', '3', '=', 'x', 'y'],
    ['0', '.', ',', '?', '^', 'z'],
  ];

  const algebraKeys = [
    [
      { label: 'x²', val: '^2' },
      { label: 'x³', val: '^3' },
      { label: 'xⁿ', val: '^' },
      { label: '√x', val: 'sqrt(' },
      { label: '³√x', val: 'cbrt(' },
      { label: '±', val: '±' },
    ],
    [
      { label: 'x₁', val: 'x1' },
      { label: 'x₂', val: 'x2' },
      { label: '1/x', val: '1/' },
      { label: '|x|', val: 'abs(' },
      { label: 'π', val: 'pi' },
      { label: 'e', val: 'e' },
    ],
    [
      { label: 'x²-5x+6=0', val: 'x^2 - 5x + 6 = 0' },
      { label: '3x+7=25', val: '3x + 7 = 25' },
      { label: '3/4+5/6', val: '3/4 + 5/6' },
      { label: 'D=b²-4ac', val: 'b^2 - 4*a*c' },
    ],
  ];

  const physicsKeys = [
    [
      { label: 'F', val: 'F' },
      { label: 'm', val: 'm' },
      { label: 'a', val: 'a' },
      { label: 'v', val: 'v' },
      { label: 's', val: 's' },
      { label: 't', val: 't' },
    ],
    [
      { label: 'U', val: 'U' },
      { label: 'I', val: 'I' },
      { label: 'R', val: 'R' },
      { label: 'P', val: 'P' },
      { label: 'Ek', val: 'Ek' },
      { label: 'g', val: 'g=9.8' },
    ],
    [
      { label: 'kg', val: ' kg' },
      { label: 'N', val: ' N' },
      { label: 'm/s', val: ' m/s' },
      { label: 'm/s²', val: ' m/s^2' },
      { label: 'km/h', val: ' km/h' },
      { label: 'J', val: ' J' },
    ],
    [
      { label: 'V (volt)', val: ' V' },
      { label: 'A (amper)', val: ' A' },
      { label: 'Ω (om)', val: ' ohm' },
      { label: 'W (vatt)', val: ' W' },
      { label: 'Δ (delta)', val: 'Δ' },
      { label: 'F=ma', val: 'F = m * a' },
    ],
  ];

  const symbolKeys = [
    [
      { label: '≤', val: '<=' },
      { label: '≥', val: '>=' },
      { label: '≠', val: '!=' },
      { label: '≈', val: '≈' },
      { label: '°', val: '°' },
      { label: '%', val: '%' },
    ],
    [
      { label: 'sin', val: 'sin(' },
      { label: 'cos', val: 'cos(' },
      { label: 'tan', val: 'tan(' },
      { label: 'log', val: 'log(' },
      { label: 'ln', val: 'ln(' },
      { label: '∑', val: 'sum(' },
    ],
    [
      { label: '∫', val: 'int(' },
      { label: 'lim', val: 'lim(' },
      { label: '∞', val: 'inf' },
      { label: '->', val: '->' },
      { label: 'a₁', val: 'a1' },
      { label: 'd', val: 'd' },
    ],
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#080F26] border border-blue-200 dark:border-blue-900/80 rounded-2xl p-3 shadow-md select-none transition-colors duration-200">
      {/* Tabs */}
      <div className="flex items-center justify-between gap-1 mb-3 border-b border-blue-200/80 dark:border-blue-900/60 pb-2">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0056E0] text-white shadow-xs'
                  : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-blue-950/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick clear & delete buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            className="px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/40 transition-colors"
            title="Hammasini tozalash (AC)"
          >
            AC
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-600 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-950 dark:hover:text-white rounded-lg border border-blue-200 dark:border-blue-800 transition-colors"
            title="Bitta belgini oʻchirish"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Keys Grid */}
      <div className="space-y-1.5">
        {activeTab === 'basic' && (
          <>
            {basicKeys.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-6 gap-1.5">
                {row.map((k) => (
                  <button
                    key={k}
                    onClick={() => onInsert(k)}
                    className="h-10 flex items-center justify-center font-mono font-bold text-sm bg-white dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-950 dark:text-blue-100 rounded-lg border border-blue-200 dark:border-blue-800/60 active:scale-95 transition-all shadow-xs"
                  >
                    {k}
                  </button>
                ))}
              </div>
            ))}
          </>
        )}

        {activeTab === 'algebra' && (
          <>
            {algebraKeys.map((row, rIdx) => (
              <div key={rIdx} className="flex flex-wrap gap-1.5">
                {row.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onInsert(item.val)}
                    className="flex-1 min-w-[50px] h-10 px-2 flex items-center justify-center font-mono text-xs font-bold bg-white dark:bg-blue-950/40 hover:bg-yellow-50 dark:hover:bg-blue-900/60 text-[#0056E0] dark:text-yellow-400 hover:border-yellow-400 dark:hover:border-yellow-400/80 rounded-lg border border-blue-200 dark:border-blue-800/60 active:scale-95 transition-all shadow-xs truncate"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </>
        )}

        {activeTab === 'physics' && (
          <>
            {physicsKeys.map((row, rIdx) => (
              <div key={rIdx} className="flex flex-wrap gap-1.5">
                {row.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onInsert(item.val)}
                    className="flex-1 min-w-[48px] h-10 px-2 flex items-center justify-center font-mono text-xs font-semibold bg-white dark:bg-blue-950/40 hover:bg-blue-50 dark:hover:bg-blue-900/60 text-[#0056E0] dark:text-blue-200 hover:border-blue-400 rounded-lg border border-blue-200 dark:border-blue-800/60 active:scale-95 transition-all shadow-xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </>
        )}

        {activeTab === 'symbols' && (
          <>
            {symbolKeys.map((row, rIdx) => (
              <div key={rIdx} className="flex flex-wrap gap-1.5">
                {row.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onInsert(item.val)}
                    className="flex-1 min-w-[50px] h-10 px-2 flex items-center justify-center font-mono text-xs font-bold bg-white dark:bg-blue-950/40 hover:bg-yellow-50 dark:hover:bg-blue-900/60 text-amber-700 dark:text-yellow-300 hover:border-amber-400 rounded-lg border border-blue-200 dark:border-blue-800/60 active:scale-95 transition-all shadow-xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Action Row */}
      <div className="mt-2.5 pt-2 border-t border-blue-200/80 dark:border-blue-900/60 flex items-center gap-2">
        <button
          onClick={() => onInsert(' ')}
          className="flex-1 h-9 text-xs font-semibold text-slate-700 dark:text-blue-200 bg-white dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors shadow-xs"
        >
          {lang.startsWith('uz') ? 'Bo‘sh joy (Space)' : lang === 'ru' ? 'Пробел' : 'Space'}
        </button>
        <button
          id="btn-solve-keyboard"
          onClick={onSubmit}
          className="flex-1 h-9 flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#0056E0] hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/20 active:scale-98 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>{lang.startsWith('uz') ? 'Yeçiş' : lang === 'ru' ? 'Решить' : 'Solve'}</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
