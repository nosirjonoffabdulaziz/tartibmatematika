import React, { useState, useMemo } from 'react';
import { UNIT_CATEGORIES, UnitCategory, convertUnits } from '../lib/unitEngine';
import { Language } from '../types';
import { MathView } from './MathView';
import { RefreshCw, ArrowRight, Check, Copy } from 'lucide-react';

interface UnitConverterModalProps {
  lang: Language;
  onInsertValue?: (text: string) => void;
}

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({
  lang,
  onInsertValue,
}) => {
  const isUz = lang.startsWith('uz');
  const isRu = lang === 'ru';

  const [categoryKey, setCategoryKey] = useState<string>('speed');
  const [inputValue, setInputValue] = useState<number>(72);
  const [fromUnit, setFromUnit] = useState<string>('km/h');
  const [toUnit, setToUnit] = useState<string>('m/s');
  const [copied, setCopied] = useState<boolean>(false);

  const currentCategory = UNIT_CATEGORIES[categoryKey] || UNIT_CATEGORIES['speed'];

  // When category changes, reset from & to units
  const handleCategoryChange = (key: string) => {
    setCategoryKey(key);
    const cat = UNIT_CATEGORIES[key];
    if (cat && cat.units.length >= 2) {
      setFromUnit(cat.units[1].symbol);
      setToUnit(cat.units[0].symbol);
    }
  };

  // Compute conversion result
  const conversionResult = useMemo(() => {
    if (isNaN(inputValue)) return null;
    return convertUnits(inputValue, fromUnit, toUnit);
  }, [inputValue, fromUnit, toUnit]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    if (!conversionResult) return;
    navigator.clipboard.writeText(`${conversionResult.result} ${toUnit}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#0B1533] border border-blue-100 dark:border-blue-900/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-[#0056E0] dark:text-yellow-400 flex items-center justify-center shrink-0">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-blue-950 dark:text-white">
            {isUz
              ? 'Xalqaro SI oʻlchov birliklari konverteri'
              : isRu
              ? 'Конвертер физических единиц измерения СИ'
              : 'SI Physical Units Converter'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-blue-200">
            {isUz
              ? 'Barcha kattaliklar uchun bosqichma-bosqich koʻpaytirish koeffitsiyentlari'
              : 'Step-by-step conversion factors and dimensional consistency for all physical units'}
          </p>
        </div>
      </div>

      {/* Category selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {Object.entries(UNIT_CATEGORIES).map(([key, cat]: [string, UnitCategory]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              categoryKey === key
                ? 'bg-[#0056E0] text-white border-blue-600 shadow-xs font-bold'
                : 'bg-blue-50/50 dark:bg-[#070D1F] text-slate-700 dark:text-blue-200 border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 hover:text-blue-950'
            }`}
          >
            {lang === 'uz-latn'
              ? cat.nameUzLatn
              : lang === 'uz-cyrl'
              ? cat.nameUzCyrl
              : lang === 'ru'
              ? cat.nameRu
              : cat.nameEn}
          </button>
        ))}
      </div>

      {/* Interactive Conversion Block */}
      <div className="bg-blue-50/40 dark:bg-[#070D1F]/80 border border-blue-100 dark:border-blue-900/60 rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
          {/* Input Value & From Unit */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-blue-300">
              {isUz ? 'Boshlangʻich qiymat' : 'From Value'}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-950 dark:text-blue-100 font-mono text-sm focus:outline-none focus:border-[#0056E0] shadow-xs"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="bg-white dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-[#0056E0] dark:text-yellow-400 font-mono text-sm font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#0056E0] cursor-pointer shadow-xs"
              >
                {currentCategory.units.map((u: { symbol: string; nameUzLatn: string }) => (
                  <option key={u.symbol} value={u.symbol}>
                    {u.symbol} ({u.nameUzLatn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-4">
            <button
              onClick={handleSwap}
              title={isUz ? 'Oʻrin almashtirish' : 'Swap'}
              className="p-2.5 rounded-full bg-white dark:bg-blue-950/80 hover:bg-[#0056E0] hover:text-white text-[#0056E0] dark:text-yellow-400 border border-blue-200 dark:border-blue-800 transition-all active:scale-95 shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Target Unit & Computed Value */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-blue-300">
              {isUz ? 'Natijaviy birlik' : 'To Unit'}
            </label>
            <div className="flex gap-2">
              <div className="w-full px-3 py-2 bg-white dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-[#0056E0] dark:text-yellow-300 font-mono text-sm font-bold flex items-center overflow-x-auto shadow-xs">
                {conversionResult ? conversionResult.result.toFixed(4).replace(/\.?0+$/, '') : '...'}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="bg-white dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-[#0056E0] dark:text-yellow-400 font-mono text-sm font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#0056E0] cursor-pointer shadow-xs"
              >
                {currentCategory.units.map((u: { symbol: string; nameUzLatn: string }) => (
                  <option key={u.symbol} value={u.symbol}>
                    {u.symbol} ({u.nameUzLatn})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step-by-Step LaTeX Factor Explanation */}
        {conversionResult && (
          <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-blue-300 uppercase tracking-wider">
                {isUz ? 'Hisoblash formulasi va koeffitsiyenti:' : 'Conversion Formula & Steps:'}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-[#0056E0] dark:text-yellow-400 hover:underline transition-colors font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isUz ? 'Nusxalandi' : 'Copied') : (isUz ? 'Nusxa olish' : 'Copy result')}</span>
              </button>
            </div>

            <div className="bg-white dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-xl p-3.5 flex items-center justify-center text-[#0056E0] dark:text-yellow-300 font-mono text-base overflow-x-auto shadow-xs font-bold">
              <MathView latex={conversionResult.latexStep} displayMode={true} />
            </div>

            <p className="text-xs text-slate-700 dark:text-blue-100 leading-relaxed font-sans">
              {lang === 'uz-latn'
                ? conversionResult.explanationUzLatn
                : lang === 'uz-cyrl'
                ? conversionResult.explanationUzCyrl
                : lang === 'ru'
                ? conversionResult.explanationRu
                : conversionResult.explanationEn}
            </p>

            {onInsertValue && (
              <button
                onClick={() => onInsertValue(`${conversionResult.result} ${toUnit}`)}
                className="py-1.5 px-3 bg-[#0056E0] hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{isUz ? 'Masala maydoniga qoʻyish' : 'Insert into problem'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
