import React from 'react';
import { SolverResult, Language } from '../types';
import { MathView } from './MathView';
import { CheckCircle2, ShieldCheck, Ruler, Scale } from 'lucide-react';

interface VerificationBadgeProps {
  result: SolverResult;
  lang: Language;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ result, lang }) => {
  const isUz = lang.startsWith('uz');
  const isRu = lang === 'ru';

  const ver = result.verification;
  const dim = result.dimensionCheck;

  const verExplanation =
    lang === 'uz-latn'
      ? ver?.explanationUzLatn
      : lang === 'uz-cyrl'
      ? ver?.explanationUzCyrl
      : lang === 'ru'
      ? ver?.explanationRu
      : ver?.explanationEn;

  return (
    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors duration-200">
      {/* Title Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-300">
              {isUz
                ? 'Deterministik tekşiriş va isbot'
                : isRu
                ? 'Детерминированная проверка и доказательство'
                : 'Deterministic Verification & Proof'}
            </h4>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 font-medium">
              {isUz
                ? 'Natija asl tenglama va oʻlchov birliklari orqali tasdiqlangan'
                : 'Result mathematically verified via original laws and dimensional consistency'}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1.5 shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{isUz ? 'Töğri' : isRu ? 'Верно' : 'Verified'}</span>
        </span>
      </div>

      {/* Verification details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {/* Left Hand Side vs Right Hand Side Check */}
        {ver && (
          <div className="bg-white dark:bg-[#070D1F] border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-3 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Scale className="w-3.5 h-3.5" />
              <span>{isUz ? 'Tenglik tekşiruvi (LHS = RHS)' : 'Equation Balance'}</span>
            </div>
            {ver.leftHandSide && ver.rightHandSide && (
              <div className="font-mono text-xs text-slate-800 dark:text-slate-200 py-1 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-slate-900 rounded border border-blue-200 dark:border-slate-800 font-semibold">
                  {ver.leftHandSide}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">=</span>
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-slate-900 rounded border border-blue-200 dark:border-slate-800 font-semibold">
                  {ver.rightHandSide}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>
              </div>
            )}
            {verExplanation && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{verExplanation}</p>
            )}
          </div>
        )}

        {/* Dimension consistency */}
        {dim && (
          <div className="bg-white dark:bg-[#070D1F] border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-3 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Ruler className="w-3.5 h-3.5" />
              <span>{isUz ? 'Oʻlchov birliklari mosligi (SI)' : 'Dimensional Consistency'}</span>
            </div>
            <div className="text-xs text-[#0056E0] dark:text-yellow-300 font-mono py-1 font-bold">
              <MathView latex={dim.expression} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isUz
                ? `Natija birligi: ${dim.resultUnit} (Standart SI ga mos)`
                : `Target unit: ${dim.resultUnit} (Physically consistent)`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
