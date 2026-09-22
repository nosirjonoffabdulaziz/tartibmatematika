import React, { useState, useMemo } from 'react';
import { FORMULA_DATABASE } from '../lib/formulaDatabase';
import { FormulaDefinition, Language } from '../types';
import { MathView } from './MathView';
import { Search, Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface FormulaLibraryProps {
  lang: Language;
  onSelectProblem: (input: string) => void;
}

export const FormulaLibrary: React.FC<FormulaLibraryProps> = ({
  lang,
  onSelectProblem,
}) => {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'math' | 'physics'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const isUz = lang.startsWith('uz');
  const isRu = lang === 'ru';

  // Extract unique topics
  const topics = useMemo(() => {
    const set = new Set<string>();
    FORMULA_DATABASE.forEach((f) => set.add(f.topic));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered list
  const filteredFormulas = useMemo(() => {
    return FORMULA_DATABASE.filter((f) => {
      // Subject filter
      if (subjectFilter !== 'all' && f.subject !== subjectFilter) return false;
      // Topic filter
      if (selectedTopic !== 'all' && f.topic !== selectedTopic) return false;
      // Search text
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        f.nameUzLatn.toLowerCase().includes(q) ||
        f.nameUzCyrl.toLowerCase().includes(q) ||
        f.nameRu.toLowerCase().includes(q) ||
        f.nameEn.toLowerCase().includes(q) ||
        f.plainFormula.toLowerCase().includes(q) ||
        f.topic.toLowerCase().includes(q) ||
        f.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [search, subjectFilter, selectedTopic]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Search Controls */}
      <div className="bg-white dark:bg-[#0B1533] border border-blue-100 dark:border-blue-900/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0056E0] dark:text-yellow-400" />
              <h2 className="text-lg sm:text-xl font-bold text-blue-950 dark:text-white">
                {isUz
                  ? 'Matematika va fizika formulalari kutubxonasi'
                  : isRu
                  ? 'Библиотека формул по математике и физике'
                  : 'Mathematics & Physics Formula Library'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-blue-200 mt-1">
              {isUz
                ? 'Har bir formula uchun keltirib chiqarishlar, birliklar va namunaviy masalalar'
                : 'Derivations, SI units, and sample interactive problems for each formula'}
            </p>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-[#070D1F] p-1 rounded-xl border border-blue-200 dark:border-blue-900/60">
            <button
              onClick={() => setSubjectFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                subjectFilter === 'all'
                  ? 'bg-[#0056E0] text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white'
              }`}
            >
              {isUz ? 'Hammasi' : isRu ? 'Все' : 'All'}
            </button>
            <button
              onClick={() => setSubjectFilter('math')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                subjectFilter === 'math'
                  ? 'bg-[#0056E0] text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white'
              }`}
            >
              {isUz ? 'Matematika' : isRu ? 'Математика' : 'Math'}
            </button>
            <button
              onClick={() => setSubjectFilter('physics')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                subjectFilter === 'physics'
                  ? 'bg-[#0056E0] text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white'
              }`}
            >
              {isUz ? 'Fizika' : isRu ? 'Физика' : 'Physics'}
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
          <input
            id="formula-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isUz
                ? 'Formula nomi, belgisi yoki mavzusi boʻyicha qidiring (masalan, Nyuton, F=ma, Om, Pifagor)...'
                : isRu
                ? 'Поиск по названию, символу или теме (напр. Ньютон, Ом, Пифагор)...'
                : 'Search by formula name, symbol, or topic (e.g. Newton, Ohm, Pythagoras)...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-blue-50/50 dark:bg-[#070D1F] border border-blue-200 dark:border-blue-800 rounded-xl text-blue-950 dark:text-slate-100 placeholder-slate-400 dark:placeholder-blue-300 text-sm focus:outline-none focus:border-[#0056E0] transition-colors shadow-inner"
          />
        </div>

        {/* Topic filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0 mr-1" />
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap border transition-colors ${
                selectedTopic === t
                  ? 'bg-[#0056E0] text-white border-[#0056E0] font-bold shadow-xs'
                  : 'bg-white dark:bg-blue-950/40 text-slate-700 dark:text-blue-200 border-blue-200 dark:border-blue-900/60 hover:text-blue-950 hover:bg-blue-50'
              }`}
            >
              {t === 'all' ? (isUz ? 'Barcha mavzular' : 'All Topics') : t}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((f) => {
          const formulaName =
            lang === 'uz-latn'
              ? f.nameUzLatn
              : lang === 'uz-cyrl'
              ? f.nameUzCyrl
              : lang === 'ru'
              ? f.nameRu
              : f.nameEn;

          const sampleText =
            lang === 'uz-latn'
              ? f.sampleProblem?.textUzLatn
              : lang === 'uz-cyrl'
              ? f.sampleProblem?.textUzCyrl
              : lang === 'ru'
              ? f.sampleProblem?.textRu
              : f.sampleProblem?.textEn;

          return (
            <div
              key={f.id}
              className="bg-white dark:bg-[#0B1533] border border-blue-100 dark:border-blue-900/60 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Header: Subject & Topic badge */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      f.subject === 'physics'
                        ? 'bg-blue-100 dark:bg-blue-950 text-[#0056E0] dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800'
                    }`}
                  >
                    {f.subject === 'physics' ? 'Fizika' : 'Matematika'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-blue-300 font-medium">{f.topic}</span>
                </div>

                {/* Name */}
                <h3 className="text-base font-bold text-blue-950 dark:text-white">{formulaName}</h3>

                {/* Formula Display Box */}
                <div className="bg-blue-50/60 dark:bg-[#070D1F] border border-blue-100 dark:border-blue-900/70 rounded-xl p-3.5 text-center text-[#0056E0] dark:text-yellow-300 font-mono text-lg shadow-inner">
                  <MathView latex={f.formulaLatex} displayMode={true} />
                </div>

                {/* Variables List */}
                <div className="space-y-1 text-xs text-slate-700 dark:text-blue-100">
                  <span className="font-bold text-slate-500 dark:text-blue-300 block mb-1">
                    {isUz ? 'Kattaliklar va birliklar:' : 'Variables & Units:'}
                  </span>
                  {Object.values(f.variables).map((v) => (
                    <div key={v.symbol} className="flex items-center justify-between py-0.5 border-b border-blue-50 dark:border-blue-950/50 last:border-none">
                      <span className="font-mono text-[#0056E0] dark:text-yellow-400 font-bold">{v.symbol}:</span>
                      <span className="text-slate-700 dark:text-blue-100">
                        {lang === 'uz-latn'
                          ? v.nameUzLatn
                          : lang === 'uz-cyrl'
                          ? v.nameUzCyrl
                          : lang === 'ru'
                          ? v.nameRu
                          : v.nameEn}
                        {v.unit ? ` [${v.unit}]` : ''}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Rearrangements */}
                {f.rearrangements && f.rearrangements.length > 0 && (
                  <div className="pt-2 border-t border-blue-100 dark:border-blue-900/60 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider block">
                      {isUz ? 'Keltirib chiqarilgan formulalar:' : 'Derivations:'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {f.rearrangements.map((r, idx) => (
                        <div
                          key={idx}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-[#0056E0] dark:text-yellow-300 font-mono font-bold"
                        >
                          <MathView latex={r.latex} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Problem & Action Button */}
              {f.sampleProblem && (
                <div className="pt-3 border-t border-blue-100 dark:border-blue-900/60 space-y-2">
                  <p className="text-xs text-slate-500 dark:text-blue-200 italic">
                    "{sampleText}"
                  </p>
                  <button
                    onClick={() => onSelectProblem(f.sampleProblem?.solutionInput || '')}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 hover:from-[#0056E0] hover:to-blue-700 text-[#0056E0] dark:text-yellow-400 hover:text-white font-bold text-xs flex items-center justify-between gap-1.5 border border-blue-200 dark:border-blue-800 transition-all shadow-xs cursor-pointer group active:scale-98"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-yellow-400 text-blue-950 flex items-center justify-center shrink-0">
                        ▶
                      </span>
                      <span>
                        {isUz
                          ? '5s animatsiyali tushuntirish va yechim'
                          : '5s Animated Step-by-Step Solution'}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFormulas.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">
            {isUz
              ? 'Mos keladigan formula topilmadi. Qidiruv soʻzini oʻzgartirib koʻring.'
              : 'No formulas matched your search query.'}
          </p>
        </div>
      )}
    </div>
  );
};
