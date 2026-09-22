import React from 'react';
import { SolverResult, Language } from '../types';
import { MathView } from './MathView';
import { X, Lightbulb, Compass, Award } from 'lucide-react';

interface WhyThisFormulaModalProps {
  result: SolverResult;
  lang: Language;
  onClose: () => void;
}

export const WhyThisFormulaModal: React.FC<WhyThisFormulaModalProps> = ({
  result,
  lang,
  onClose,
}) => {
  const why = result.whyThisFormula;
  const isUz = lang.startsWith('uz');

  const explanation =
    lang === 'uz-latn'
      ? why?.explanationUzLatn
      : lang === 'uz-cyrl'
      ? why?.explanationUzCyrl
      : lang === 'ru'
      ? why?.explanationRu
      : why?.explanationEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#0B1533] border border-blue-100 dark:border-blue-900/60 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative transition-colors duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-950 dark:hover:text-white bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full border border-blue-100 dark:border-blue-900/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-100 dark:bg-yellow-950/60 border border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-950 dark:text-white">
              {isUz ? 'Nega aynan shu formula tanlandi?' : 'Why this exact formula?'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-blue-200">
              {isUz
                ? 'Fizik va matematik qonuniyatlar mantigʻi'
                : 'Scientific rationale & choice of physical relationship'}
            </p>
          </div>
        </div>

        {/* Formula Representation */}
        {result.givenFind?.primaryFormula && (
          <div className="bg-blue-50/50 dark:bg-[#070D1F] border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 text-center shadow-xs">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-blue-300 font-bold block mb-1">
              {isUz ? 'Asosiy qonuniyat' : 'Primary Relationship'}
            </span>
            <div className="text-[#0056E0] dark:text-yellow-300 font-mono text-lg font-bold">
              <MathView latex={result.givenFind.primaryFormula} displayMode={true} />
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="space-y-3 text-sm text-slate-700 dark:text-blue-100 leading-relaxed font-sans">
          <p>{explanation || (isUz ? 'Ushbu masala uchun eng toʻgʻri va qisqa yoʻl tanlandi.' : 'Optimal fundamental law selected.')}</p>

          <div className="bg-blue-50/40 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0056E0] dark:text-yellow-400">
              <Compass className="w-4 h-4" />
              <span>{isUz ? 'Asosiy mezonlar' : 'Selection Criteria'}</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-blue-200 space-y-1.5 list-disc pl-4">
              <li>
                {isUz
                  ? 'Berilgan kattaliklar soni va nomaʼlum oʻrtasida toʻgʻridan-toʻgʻri bogʻliqlik mavjud.'
                  : 'Direct relationship between known parameters and the target unknown.'}
              </li>
              <li>
                {isUz
                  ? 'Ortiqcha nomaʼlumlarsiz bitta yagona algebraik ifodaga keltirildi.'
                  : 'Eliminates redundant variables with a single algebraic expression.'}
              </li>
              <li>
                {isUz
                  ? 'SI xalqaro birliklar tizimida oʻlchovlar toʻliq mos keladi.'
                  : 'Guarantees dimensionally sound physical units.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Got it button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#0056E0] hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-xs"
        >
          {isUz ? 'Tushunarli (Rahmat)' : 'Got it!'}
        </button>
      </div>
    </div>
  );
};
