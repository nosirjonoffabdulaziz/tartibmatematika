import React from 'react';
import { SolvedHistoryItem, Language } from '../types';
import { X, Trash2, ArrowUpRight, History, Download } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: SolvedHistoryItem[];
  onSelectItem: (input: string) => void;
  onClearHistory: () => void;
  lang: Language;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onClearHistory,
  lang,
}) => {
  if (!isOpen) return null;

  const isUz = lang.startsWith('uz');

  const handleExportText = () => {
    const text = items
      .map(
        (it, idx) =>
          `[${idx + 1}] ${it.subject.toUpperCase()} (${new Date(it.timestamp).toLocaleString()}):\nMasala: ${it.input}\nJavob: ${it.answer}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IlmHub_Math_Tarix_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-[#080F26] border-l border-blue-100 dark:border-blue-900/60 h-full p-5 flex flex-col justify-between shadow-2xl transition-colors duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-100 dark:border-blue-900/60">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#0056E0] dark:text-yellow-400" />
            <h3 className="font-bold text-blue-950 dark:text-white text-base">
              {isUz ? 'Yechilgan masalalar tarixi' : 'Solved Problems History'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-blue-950 dark:hover:text-white rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {items.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-blue-300 text-sm">
              {isUz ? 'Tarix hali boʻsh' : 'No history yet'}
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item.input);
                  onClose();
                }}
                className="bg-blue-50/50 hover:bg-blue-100/60 dark:bg-[#070D1F] dark:hover:bg-blue-950/60 border border-blue-100 hover:border-blue-300 dark:border-blue-900/60 dark:hover:border-yellow-400/50 rounded-xl p-3 cursor-pointer transition-all duration-150 space-y-1.5 group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                      item.subject === 'physics'
                        ? 'bg-blue-100 dark:bg-blue-950 text-[#0056E0] dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800'
                    }`}
                  >
                    {item.subject === 'physics' ? 'Fizika' : 'Matematika'}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-blue-300 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs font-bold text-blue-950 dark:text-blue-100 line-clamp-2 group-hover:text-[#0056E0] dark:group-hover:text-yellow-300 transition-colors">
                  {item.input}
                </p>

                {item.answer && (
                  <p className="text-[11px] text-slate-600 dark:text-blue-200 font-mono flex items-center justify-between">
                    <span>{item.answer}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#0056E0] dark:text-yellow-400 transition-opacity" />
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="pt-3 border-t border-blue-100 dark:border-blue-900/60 flex items-center gap-2">
            <button
              onClick={handleExportText}
              className="flex-1 py-2 px-3 bg-[#0056E0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isUz ? 'Yuklab olish' : 'Export TXT'}</span>
            </button>
            <button
              onClick={onClearHistory}
              className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/40 transition-colors"
              title={isUz ? 'Tarixni tozalash' : 'Clear all'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
