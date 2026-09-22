export type Language = 'uz-latn' | 'uz-cyrl' | 'ru' | 'en';
export type ThemeMode = 'light' | 'dark' | 'system';

export type SubjectType = 'math' | 'physics' | 'general';

export type ProblemType =
  | 'arithmetic'
  | 'fraction'
  | 'linear-equation'
  | 'quadratic-equation'
  | 'equation-system'
  | 'inequality'
  | 'trigonometry'
  | 'calculus-derivative'
  | 'calculus-integral'
  | 'matrix'
  | 'vector'
  | 'statistics'
  | 'geometry'
  | 'physics-mechanics'
  | 'physics-electricity'
  | 'physics-thermal'
  | 'physics-optics'
  | 'physics-waves'
  | 'unit-conversion'
  | 'word-problem';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface VariableItem {
  symbol: string;
  nameUzLatn: string;
  nameUzCyrl: string;
  nameRu: string;
  nameEn: string;
  value?: number | string;
  unit: string;
  isUnknown?: boolean;
}

export interface SolutionStep {
  id: string;
  stepNumber: number;
  stage: 'understand' | 'given' | 'find' | 'formula' | 'rearrange' | 'substitute' | 'calculate' | 'verify' | 'answer';
  titleUzLatn: string;
  titleUzCyrl: string;
  titleRu: string;
  titleEn: string;
  explanationUzLatn: string;
  explanationUzCyrl: string;
  explanationRu: string;
  explanationEn: string;
  latex: string;
  plainText?: string;
  highlightTerms?: string[];
  canceledTerms?: string[];
  arrowNotice?: string;
  operationType?: 'add' | 'subtract' | 'multiply' | 'divide' | 'factor' | 'simplify' | 'substitute' | 'rearrange' | 'verify';
  operationValue?: string | number;
}

export interface GivenFindSection {
  given: { label: string; symbol: string; value: string; unit: string }[];
  find: { label: string; symbol: string; unit: string }[];
  primaryFormula: string;
  rearrangedFormula?: string;
}

export interface VerificationResult {
  valid: boolean;
  leftHandSide?: string;
  rightHandSide?: string;
  explanationUzLatn: string;
  explanationUzCyrl: string;
  explanationRu: string;
  explanationEn: string;
}

export interface OrderOfOperationStep {
  orderNumber: number; // 1, 2, 3...
  titleUzLatn: string;
  titleUzCyrl: string;
  titleRu: string;
  titleEn: string;
  ruleExplanationUzLatn: string;
  ruleExplanationUzCyrl: string;
  ruleExplanationRu: string;
  ruleExplanationEn: string;
  subExpression: string; // e.g. "18 - 6", "EKUK(4, 6) = 12", "D = b^2 - 4ac"
  subResult: number | string; // e.g. "12"
  operationType: 'bracket' | 'power' | 'multiply' | 'divide' | 'add' | 'subtract' | 'fraction' | 'equation' | 'formula';
  previousExpression: string;
  resultingExpression: string;
  highlightSnippet: string;
}

export interface OrderOfOperationsBreakdown {
  originalExpression: string;
  formattedDisplay: string;
  operatorOrderBadges: {
    operatorIndex: number;
    symbol: string;
    orderNumber: number;
  }[];
  steps: OrderOfOperationStep[];
  finalAnswer: string | number;
}

export interface SolverResult {
  success: boolean;
  subject: SubjectType;
  problemType: ProblemType;
  difficulty: DifficultyLevel;
  originalInput: string;
  normalizedExpression: string;
  targetUnknown: string;
  givenFind?: GivenFindSection;
  steps: SolutionStep[];
  finalAnswerLatex: string;
  finalAnswerExact: string;
  finalAnswerApprox?: string;
  unit?: string;
  verified: boolean;
  verification?: VerificationResult;
  whyThisFormula?: {
    formulaId?: string;
    explanationUzLatn: string;
    explanationUzCyrl: string;
    explanationRu: string;
    explanationEn: string;
  };
  dimensionCheck?: {
    expression: string;
    resultUnit: string;
    isConsistent: boolean;
  };
  orderOfOperations?: OrderOfOperationsBreakdown;
  errorMessage?: string;
}

export interface FormulaDefinition {
  id: string;
  subject: 'math' | 'physics';
  topic: string;
  nameUzLatn: string;
  nameUzCyrl: string;
  nameRu: string;
  nameEn: string;
  formulaLatex: string;
  plainFormula: string;
  variables: Record<string, VariableItem>;
  rearrangements: { target: string; latex: string; explanationUzLatn: string }[];
  conditions?: string;
  sampleProblem: {
    textUzLatn: string;
    textUzCyrl: string;
    textRu: string;
    textEn: string;
    solutionInput: string;
  };
  keywords: string[];
}

export interface SolvedHistoryItem {
  id: string;
  userId?: string;
  input: string;
  subject: SubjectType;
  problemType: ProblemType;
  answer: string;
  verified: boolean;
  timestamp: number;
}

export interface UserPreferences {
  language: Language;
  theme: ThemeMode;
  animationSpeed: number; // 0.5, 1, 1.5, 2
  reduceMotion: boolean;
  exactDecimalPreference: 'exact' | 'approximate' | 'both';
  angleMode: 'degrees' | 'radians';
  unitSystem: 'SI';
  educationalMode: 'educational' | 'quick';
}

export interface QuizQuestion {
  id: string;
  category: 'fraction' | 'order-of-operations' | 'equation' | 'physics';
  level: 'school' | 'lyceum' | 'college' | 'university';
  questionUzLatn: string;
  questionUzCyrl: string;
  questionRu: string;
  questionEn: string;
  problemInput: string; // The mathematical input to solve (e.g. "3/4 + 5/6", "24 + (18 - 6) * 3")
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanationUzLatn: string;
  explanationUzCyrl: string;
  explanationRu: string;
  explanationEn: string;
}
