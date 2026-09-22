import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { Camera, Upload, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageOcrModalProps {
  lang: Language;
  onClose: () => void;
  onExtracted: (text: string) => void;
}

export const ImageOcrModal: React.FC<ImageOcrModalProps> = ({
  lang,
  onClose,
  onExtracted,
}) => {
  const isUz = lang.startsWith('uz');
  const isRu = lang === 'ru';

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sample presets for quick testing
  const samplePresets = [
    {
      label: isUz ? 'Kvadrat tenglama fotosi' : 'Quadratic equation photo',
      problemText: 'x^2 - 5x + 6 = 0',
      sampleCanvasData: () => createSampleImage('x² - 5x + 6 = 0'),
    },
    {
      label: isUz ? 'Nyuton qonuni fotosi' : 'Newton problem photo',
      problemText: 'm = 5 kg, F = 20 N, a = ?',
      sampleCanvasData: () => createSampleImage('m = 5 kg, F = 20 N, a = ?'),
    },
    {
      label: isUz ? 'Om qonuni fotosi' : 'Ohm law problem photo',
      problemText: 'U = 12 V, R = 4 ohm, I = ?',
      sampleCanvasData: () => createSampleImage('U = 12 V, R = 4 Ω, I = ?'),
    },
  ];

  function createSampleImage(text: string): string {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 400, 150);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(10, 10, 380, 130);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(text, 200, 85);
    }
    return canvas.toDataURL('image/png');
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setExtractedText('');
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleExtract = async () => {
    if (!imagePreview) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/vision/extract-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: 'image/png',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.extractedText) {
          setExtractedText(data.extractedText);
          return;
        }
      }

      // If server vision failed or returned empty, extract text from preset if available
      const matched = samplePresets.find((p) => p.sampleCanvasData() === imagePreview);
      if (matched) {
        setExtractedText(matched.problemText);
      } else {
        setErrorMsg(
          isUz
            ? 'Rasmdan matnni aniqlab boʻlmadi. Iltimos, sifatliroq rasm yuklang.'
            : 'Could not detect clear math problem from image.'
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server xatoligi');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-[#0056E0] dark:text-yellow-400 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-950 dark:text-white">
              {isUz ? 'Masala rasmini tanib olish (OCR)' : 'Scan Problem Photo (OCR)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-blue-200">
              {isUz
                ? 'Darslik yoki qoʻlyozma fotosini yuklang'
                : 'Upload photo from textbook or notebook'}
            </p>
          </div>
        </div>

        {/* Upload Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-200 dark:border-blue-800/80 hover:border-[#0056E0] dark:hover:border-yellow-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-blue-50/30 dark:bg-[#070D1F]/60"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {imagePreview ? (
            <div className="space-y-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-44 mx-auto rounded-xl border border-blue-200 dark:border-blue-800 object-contain shadow-xs"
              />
              <p className="text-xs text-[#0056E0] dark:text-yellow-400 font-bold">
                {isUz ? 'Boshqa rasm tanlash uchun bosing' : 'Click to change photo'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-[#0056E0] dark:text-yellow-400 mx-auto" />
              <p className="text-sm font-bold text-blue-950 dark:text-white">
                {isUz ? 'Rasmni tanlang yoki bu yerga tortib tashlang' : 'Choose photo or drag and drop'}
              </p>
              <p className="text-xs text-slate-500 dark:text-blue-200">PNG, JPG, WEBP (maksimal 10MB)</p>
            </div>
          )}
        </div>

        {/* Quick Presets for Demo */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-600 dark:text-blue-300 block">
            {isUz ? 'Yoki tezkor sinov namunalaridan birini tanlang:' : 'Or choose sample image:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setImagePreview(p.sampleCanvasData());
                  setExtractedText(p.problemText);
                  setErrorMsg(null);
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/80 dark:hover:bg-blue-900 text-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800 font-semibold transition-colors shadow-xs"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Extracted Text Display */}
        {extractedText && (
          <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/50 border border-emerald-300 dark:border-emerald-800/80 rounded-xl space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isUz ? 'Aniqlangan masala matni:' : 'Extracted Text:'}</span>
            </div>
            <p className="text-sm font-mono text-[#0056E0] dark:text-yellow-300 font-bold bg-white dark:bg-[#070D1F] p-2.5 rounded-lg border border-blue-200 dark:border-blue-800">
              {extractedText}
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {extractedText ? (
            <button
              onClick={() => {
                onExtracted(extractedText);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isUz ? 'Masalani yechishga oʻtkazish' : 'Send to Solver'}</span>
            </button>
          ) : (
            <button
              onClick={handleExtract}
              disabled={!imagePreview || loading}
              className="w-full py-2.5 rounded-xl bg-[#0056E0] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {loading
                  ? isUz
                    ? 'AI tahlil qilmoqda...'
                    : 'Analyzing with Gemini Vision...'
                  : isUz
                  ? 'Matnni ajratib olish (OCR)'
                  : 'Extract Problem'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
