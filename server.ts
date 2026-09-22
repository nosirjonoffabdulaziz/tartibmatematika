import express from 'express';
import path from 'path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { solveFractionArithmetic, solveLinearEquation, solveQuadraticEquation, solveArithmetic } from './src/lib/mathEngine';
import { solvePhysicsProblem } from './src/lib/physicsEngine';
import { convertUnits } from './src/lib/unitEngine';
import { FORMULA_DATABASE } from './src/lib/formulaDatabase';
import { SolverResult, SolvedHistoryItem } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '12mb' }));

// In-memory history cache
const historyStore: SolvedHistoryItem[] = [];

// Initialize Gemini client lazily/safely
let genAiClient: GoogleGenAI | null = null;
function getGenAi(): GoogleGenAI | null {
  if (!genAiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    genAiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Unit conversion endpoint
app.post('/api/convert-units', (req, res) => {
  const { value, from, to } = req.body;
  if (typeof value !== 'number' || !from || !to) {
    return res.status(400).json({ error: 'value (number), from (string), and to (string) are required' });
  }
  const result = convertUnits(value, from, to);
  if (!result) {
    return res.status(400).json({ error: 'Incompatible or unsupported units' });
  }
  return res.json(result);
});

// 3. Formula library endpoints
app.get('/api/formulas', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const topic = req.query.topic as string;

  let results = FORMULA_DATABASE;
  if (topic && topic !== 'all') {
    results = results.filter((f) => f.topic.toLowerCase().includes(topic.toLowerCase()));
  }
  if (query) {
    results = results.filter((f) =>
      f.nameUzLatn.toLowerCase().includes(query) ||
      f.nameUzCyrl.toLowerCase().includes(query) ||
      f.nameRu.toLowerCase().includes(query) ||
      f.nameEn.toLowerCase().includes(query) ||
      f.plainFormula.toLowerCase().includes(query) ||
      f.keywords.some((k) => k.toLowerCase().includes(query))
    );
  }
  res.json(results);
});

app.get('/api/formulas/:id', (req, res) => {
  const formula = FORMULA_DATABASE.find((f) => f.id === req.params.id);
  if (!formula) return res.status(404).json({ error: 'Formula not found' });
  res.json(formula);
});

// 4. Problem OCR / Vision Extraction endpoint
app.post('/api/vision/extract-problem', async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }

  const ai = getGenAi();
  if (!ai) {
    return res.status(503).json({ error: 'Gemini API is not configured or unavailable' });
  }

  try {
    const cleanData = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const cleanMime = mimeType || 'image/png';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: cleanMime,
            data: cleanData,
          },
        },
        {
          text: `You are an expert OCR and mathematical/physical problem parser for the educational platform IlmHub Math.
Carefully extract the exact mathematical or physics problem text from this image.
Preserve formulas in standard readable notation or LaTeX (e.g. 3x + 7 = 25 or F = 20 N).
Do not solve the problem yet. Just output a clean JSON object:
{
  "extractedText": "the exact problem text or equation",
  "subject": "math" or "physics",
  "topic": "algebra" | "geometry" | "mechanics" | "electricity" | etc,
  "confidence": 0.95
}`,
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Vision extraction error:', err);
    return res.status(500).json({ error: err.message || 'Failed to extract problem from image' });
  }
});

// 5. Main Solver API
app.post('/api/solve', async (req, res) => {
  const { input, preferServer } = req.body;
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'input string is required' });
  }

  const trimmed = input.trim();

  // Try deterministic engine first unless forced to server
  if (!preferServer) {
    const frac = solveFractionArithmetic(trimmed);
    if (frac) return res.json(frac);

    const quad = solveQuadraticEquation(trimmed);
    if (quad) return res.json(quad);

    const lin = solveLinearEquation(trimmed);
    if (lin) return res.json(lin);

    const phys = solvePhysicsProblem(trimmed);
    if (phys) return res.json(phys);

    const arith = solveArithmetic(trimmed);
    if (arith) return res.json(arith);
  }

  // Use Gemini with high thinking if available
  const ai = getGenAi();
  if (ai) {
    try {
      const prompt = `Solve this mathematical or physics problem step-by-step for educational platform IlmHub Math.
Problem: "${trimmed}"

Instructions:
1. Determine whether subject is "math" or "physics".
2. Break down into sequential educational stages: understand, given, find, formula, rearrange, substitute, calculate, verify, answer.
3. For Uzbek Latin text (titleUzLatn and explanationUzLatn), you MUST strictly use the custom transliteration:
   Gʻ gʻ -> Ğ ğ
   Oʻ oʻ -> Ö ö
   Sh sh -> Ş ş
   Ch ch -> Ç ç
   (e.g., "yeçiş", "tekşiriş", "keltirib çiqariş", "bölamiz", "öng tomon").
4. Provide titles and detailed explanations in:
   - titleUzLatn, explanationUzLatn
   - titleUzCyrl, explanationUzCyrl
   - titleRu, explanationRu
   - titleEn, explanationEn
5. For every step, provide clean LaTeX formatted mathematical expression.
6. Verify the answer by substituting back into original equations.
7. Return strictly a JSON object conforming to SolverResult:
{
  "success": true,
  "subject": "math" | "physics",
  "problemType": "linear-equation" | "quadratic-equation" | "fraction" | "physics-mechanics" | "physics-electricity" | "geometry" | "word-problem",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "originalInput": "${trimmed}",
  "normalizedExpression": "...",
  "targetUnknown": "...",
  "givenFind": {
    "given": [{"label": "...", "symbol": "...", "value": "...", "unit": "..."}],
    "find": [{"label": "...", "symbol": "...", "unit": "..."}],
    "primaryFormula": "...",
    "rearrangedFormula": "..."
  },
  "steps": [
    {
      "id": "step-1",
      "stepNumber": 1,
      "stage": "understand" | "given" | "find" | "formula" | "rearrange" | "substitute" | "calculate" | "verify" | "answer",
      "titleUzLatn": "...",
      "titleUzCyrl": "...",
      "titleRu": "...",
      "titleEn": "...",
      "explanationUzLatn": "...",
      "explanationUzCyrl": "...",
      "explanationRu": "...",
      "explanationEn": "...",
      "latex": "..."
    }
  ],
  "finalAnswerLatex": "...",
  "finalAnswerExact": "...",
  "finalAnswerApprox": "...",
  "unit": "...",
  "verified": true,
  "verification": {
    "valid": true,
    "explanationUzLatn": "...",
    "explanationUzCyrl": "...",
    "explanationRu": "...",
    "explanationEn": "..."
  },
  "whyThisFormula": {
    "explanationUzLatn": "...",
    "explanationUzCyrl": "...",
    "explanationRu": "...",
    "explanationEn": "..."
  }
}`;

      let responseText: string | undefined;

      // Try gemini-3.1-pro-preview with ThinkingLevel.HIGH as mandated
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            responseMimeType: 'application/json',
            systemInstruction: 'You are IlmHub Math’s elite deterministic mathematics and physics educator. Always perform accurate calculations, verify physical dimensions, and use high educational clarity.',
          },
        });
        responseText = response.text;
      } catch (proError) {
        console.warn('gemini-3.1-pro-preview failed or requires billing, falling back to gemini-3.8-flash:', proError);
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction: 'You are IlmHub Math’s elite deterministic mathematics and physics educator.',
          },
        });
        responseText = fallbackResponse.text;
      }

      if (responseText) {
        const parsedResult = JSON.parse(responseText.trim());
        if (parsedResult.success && parsedResult.steps && parsedResult.steps.length > 0) {
          // Store in history
          historyStore.unshift({
            id: `hist-${Date.now()}`,
            input: trimmed,
            subject: parsedResult.subject,
            problemType: parsedResult.problemType,
            answer: parsedResult.finalAnswerExact || parsedResult.finalAnswerLatex,
            verified: parsedResult.verified,
            timestamp: Date.now(),
          });
          if (historyStore.length > 50) historyStore.pop();

          return res.json(parsedResult);
        }
      }
    } catch (err: any) {
      console.error('Gemini solver invocation failed:', err);
    }
  }

  // Fallback to deterministic heuristic if available
  const linFallback = solveLinearEquation(trimmed);
  if (linFallback) return res.json(linFallback);
  const quadFallback = solveQuadraticEquation(trimmed);
  if (quadFallback) return res.json(quadFallback);
  const fracFallback = solveFractionArithmetic(trimmed);
  if (fracFallback) return res.json(fracFallback);
  const physFallback = solvePhysicsProblem(trimmed);
  if (physFallback) return res.json(physFallback);
  const arithFallback = solveArithmetic(trimmed);
  if (arithFallback) return res.json(arithFallback);

  return res.status(422).json({
    success: false,
    subject: 'general',
    problemType: 'word-problem',
    difficulty: 'Intermediate',
    originalInput: trimmed,
    normalizedExpression: trimmed,
    targetUnknown: '',
    steps: [],
    finalAnswerLatex: '',
    finalAnswerExact: '',
    verified: false,
    errorMessage: 'Uşbu masalani avtomatik yechish imkoni bölmadi. Iltimos, belgilarni aniqroq yozing yoki formulalar ruknidan tekşiring.',
  });
});

// 6. History endpoints
app.get('/api/history', (req, res) => {
  res.json(historyStore.slice(0, 30));
});

app.post('/api/history', (req, res) => {
  const item = req.body;
  if (!item || !item.input) return res.status(400).json({ error: 'item is required' });
  const historyItem: SolvedHistoryItem = {
    id: `hist-${Date.now()}`,
    input: item.input,
    subject: item.subject || 'math',
    problemType: item.problemType || 'linear-equation',
    answer: item.answer || '',
    verified: item.verified ?? true,
    timestamp: Date.now(),
  };
  historyStore.unshift(historyItem);
  if (historyStore.length > 50) historyStore.pop();
  res.json(historyItem);
});

app.delete('/api/history/:id', (req, res) => {
  const idx = historyStore.findIndex((h) => h.id === req.params.id);
  if (idx !== -1) historyStore.splice(idx, 1);
  res.json({ success: true });
});

// 7. Vite middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 IlmHub Math server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
