import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
  fallbackText?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  latex,
  displayMode = false,
  className = '',
  fallbackText,
}) => {
  const renderedHtml = useMemo(() => {
    if (!latex) return '';
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch (e) {
      console.warn('KaTeX render error:', e);
      return fallbackText || latex;
    }
  }, [latex, displayMode, fallbackText]);

  if (!latex) return null;

  return (
    <span
      className={`katex-wrapper inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
