import { SolverResult } from '../types';
import { solveFractionArithmetic, solveLinearEquation, solveQuadraticEquation, solveArithmetic } from './mathEngine';
import { solvePhysicsProblem } from './physicsEngine';
import { solveOrderOfOperations, createOrderOfOperationsFromSteps } from './orderOfOperationsEngine';

function ensureOrderOfOperations(result: SolverResult, originalInput: string): SolverResult {
  if (result.success && !result.orderOfOperations && result.steps && result.steps.length > 0) {
    result.orderOfOperations = createOrderOfOperationsFromSteps(
      result.originalInput || originalInput,
      result.steps,
      result.finalAnswerExact || result.finalAnswerLatex
    );
  }
  return result;
}

export async function solveProblem(input: string, preferServer = false): Promise<SolverResult> {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      subject: 'general',
      problemType: 'arithmetic',
      difficulty: 'Beginner',
      originalInput: input,
      normalizedExpression: '',
      targetUnknown: '',
      steps: [],
      finalAnswerLatex: '',
      finalAnswerExact: '',
      verified: false,
      errorMessage: 'Masala kiritilmadi (No input provided)',
    };
  }

  // 1. If not strictly forcing server, try our deterministic engines first (sub-millisecond instant speed)
  if (!preferServer) {
    // Try order of operations breakdown first for arithmetic expressions with multiple operations
    const orderRes = solveOrderOfOperations(trimmed);
    if (orderRes) return ensureOrderOfOperations(orderRes, trimmed);

    // Try fraction arithmetic
    const fracRes = solveFractionArithmetic(trimmed);
    if (fracRes) return ensureOrderOfOperations(fracRes, trimmed);

    // Try quadratic equation
    const quadRes = solveQuadraticEquation(trimmed);
    if (quadRes) return ensureOrderOfOperations(quadRes, trimmed);

    // Try linear equation
    const linRes = solveLinearEquation(trimmed);
    if (linRes) return ensureOrderOfOperations(linRes, trimmed);

    // Try deterministic physics problem
    const physRes = solvePhysicsProblem(trimmed);
    if (physRes) return ensureOrderOfOperations(physRes, trimmed);

    // Try basic arithmetic
    const arithRes = solveArithmetic(trimmed);
    if (arithRes) return ensureOrderOfOperations(arithRes, trimmed);
  }

  // 2. Call backend server solver for complex word problems, calculus, higher algebra, and AI-assisted parsing
  try {
    const res = await fetch('/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: trimmed }),
    });

    if (res.ok) {
      const data: SolverResult = await res.json();
      if (data && data.steps && data.steps.length > 0) {
        return ensureOrderOfOperations(data, trimmed);
      }
    }
  } catch (err) {
    console.warn('Backend solve fetch failed, falling back to local heuristic', err);
  }

  // 3. Fallback attempt if backend is unreachable
  const orderFallback = solveOrderOfOperations(trimmed);
  if (orderFallback) return ensureOrderOfOperations(orderFallback, trimmed);
  const fracFallback = solveFractionArithmetic(trimmed);
  if (fracFallback) return ensureOrderOfOperations(fracFallback, trimmed);
  const linFallback = solveLinearEquation(trimmed);
  if (linFallback) return ensureOrderOfOperations(linFallback, trimmed);
  const quadFallback = solveQuadraticEquation(trimmed);
  if (quadFallback) return ensureOrderOfOperations(quadFallback, trimmed);
  const physFallback = solvePhysicsProblem(trimmed);
  if (physFallback) return ensureOrderOfOperations(physFallback, trimmed);
  const arithFallback = solveArithmetic(trimmed);
  if (arithFallback) return ensureOrderOfOperations(arithFallback, trimmed);

  return {
    success: false,
    subject: 'general',
    problemType: 'word-problem',
    difficulty: 'Intermediate',
    originalInput: input,
    normalizedExpression: input,
    targetUnknown: 'x',
    steps: [],
    finalAnswerLatex: '',
    finalAnswerExact: '',
    verified: false,
    errorMessage: "Masalani avtomatik yechish imkoni bo‘lmadi. Iltimos, ifodani aniqroq yozing yoki formulalar bo‘limidan foydalaning.",
  };
}

