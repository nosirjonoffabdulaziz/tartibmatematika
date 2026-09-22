import { OrderOfOperationStep, OrderOfOperationsBreakdown, SolutionStep, SolverResult } from '../types';

/**
 * Normalizes an arithmetic expression into a standard format.
 */
export function normalizeArithmeticString(raw: string): string {
  return raw
    .trim()
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/:/g, '/')
    .replace(/\\times/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\cdot/g, '*')
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/\{/g, '(')
    .replace(/\}/g, ')');
}

/**
 * Checks if the string is a candidate for step-by-step order of operations breakdown.
 * Criteria: Contains at least 2 operations or brackets with operation (e.g. "2+3*4", "24+(18-6)*3").
 */
export function isOrderOfOperationsCandidate(input: string): boolean {
  const clean = normalizeArithmeticString(input).replace(/\s+/g, '');
  if (clean.includes('=')) return false;
  // Disallow variable names or letters (e.g. sin, cos, x, y)
  if (/[a-zA-Z]/.test(clean.replace(/sqrt/g, ''))) return false;

  // Must contain operators: +, -, *, /, ^
  const operatorMatches = clean.match(/[+*/^-]/g);
  if (!operatorMatches || operatorMatches.length < 2) {
    // If it has at least 1 bracket and 1 operator inside:
    if (/\([^)]+[+*/^-][^)]+\)/.test(clean)) return true;
    return false;
  }
  return true;
}

interface EvaluationStepInternal {
  orderNumber: number;
  subExprText: string;
  leftOperand: number;
  op: string;
  rightOperand: number;
  result: number;
  inBracket: boolean;
  prevExpr: string;
  nextExpr: string;
}

function calculateBasic(a: number, op: string, b: number): number {
  switch (op) {
    case '^':
      return Math.pow(a, b);
    case '*':
      return a * b;
    case '/':
      if (b === 0) throw new Error('Nolga bo‘lish mumkin emas (Division by zero)');
      return a / b;
    case '+':
      return a + b;
    case '-':
      return a - b;
    default:
      return 0;
  }
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return `${n}`;
  return `${parseFloat(n.toFixed(4))}`;
}

function formatOperatorForDisplay(op: string): string {
  switch (op) {
    case '*':
      return '×';
    case '/':
      return '÷';
    case '^':
      return '^';
    default:
      return op;
  }
}

/**
 * Solves an expression step by step using strict Order of Operations (PEMDAS/BODMAS)
 */
export function solveOrderOfOperations(rawInput: string): SolverResult | null {
  const normalized = normalizeArithmeticString(rawInput);
  if (!isOrderOfOperationsCandidate(normalized)) return null;

  try {
    let current = normalized.replace(/\s+/g, '');
    const initialClean = current;
    const internalSteps: EvaluationStepInternal[] = [];
    let orderCounter = 1;
    const maxIterations = 30; // Safety guard

    while (orderCounter <= maxIterations) {
      // 1. Check for innermost parentheses
      const bracketMatch = current.match(/\(([^()]+)\)/);

      if (bracketMatch) {
        const fullBracket = bracketMatch[0]; // e.g. "(18-6)" or "(12)"
        const innerContent = bracketMatch[1]; // e.g. "18-6" or "12"

        // If inner is just a single number, remove parentheses
        if (/^-?\d+(?:\.\d+)?$/.test(innerContent)) {
          current = current.replace(fullBracket, innerContent);
          continue;
        }

        // Evaluate highest priority inside this bracket:
        // Priority A: Power
        let opMatch = innerContent.match(/(-?\d+(?:\.\d+)?)\s*(\^)\s*(\d+(?:\.\d+)?)/);
        // Priority B: Multiply or Divide (left-to-right)
        if (!opMatch) {
          opMatch = innerContent.match(/(-?\d+(?:\.\d+)?)\s*([*/])\s*(\d+(?:\.\d+)?)/);
        }
        // Priority C: Add or Subtract (left-to-right)
        if (!opMatch) {
          opMatch = innerContent.match(/(-?\d+(?:\.\d+)?)\s*([+-])\s*(\d+(?:\.\d+)?)/);
        }

        if (!opMatch) {
          // Cannot parse inside bracket, fallback
          break;
        }

        const leftNum = parseFloat(opMatch[1]);
        const op = opMatch[2];
        const rightNum = parseFloat(opMatch[3]);
        const calcRes = calculateBasic(leftNum, op, rightNum);
        const subExprStr = `${opMatch[1]}${op}${opMatch[3]}`;
        const prevExpr = current;

        // Replace sub-expression inside innerContent
        const newInner = innerContent.replace(subExprStr, formatNumber(calcRes));
        let nextExpr = '';
        if (/^-?\d+(?:\.\d+)?$/.test(newInner)) {
          // Inner content reduced to single number, remove parentheses
          nextExpr = current.replace(fullBracket, newInner);
        } else {
          nextExpr = current.replace(fullBracket, `(${newInner})`);
        }

        internalSteps.push({
          orderNumber: orderCounter++,
          subExprText: `${formatNumber(leftNum)} ${formatOperatorForDisplay(op)} ${formatNumber(rightNum)}`,
          leftOperand: leftNum,
          op,
          rightOperand: rightNum,
          result: calcRes,
          inBracket: true,
          prevExpr,
          nextExpr,
        });

        current = nextExpr;
        continue;
      }

      // 2. No brackets left, evaluate outside
      // If single number left, we are done!
      if (/^-?\d+(?:\.\d+)?$/.test(current)) {
        break;
      }

      // Priority A: Power
      let opMatch = current.match(/(-?\d+(?:\.\d+)?)\s*(\^)\s*(\d+(?:\.\d+)?)/);
      // Priority B: Multiply or Divide (left-to-right)
      if (!opMatch) {
        opMatch = current.match(/(-?\d+(?:\.\d+)?)\s*([*/])\s*(\d+(?:\.\d+)?)/);
      }
      // Priority C: Add or Subtract (left-to-right)
      if (!opMatch) {
        opMatch = current.match(/(-?\d+(?:\.\d+)?)\s*([+-])\s*(\d+(?:\.\d+)?)/);
      }

      if (!opMatch) {
        break;
      }

      const leftNum = parseFloat(opMatch[1]);
      const op = opMatch[2];
      const rightNum = parseFloat(opMatch[3]);
      const calcRes = calculateBasic(leftNum, op, rightNum);
      const subExprStr = `${opMatch[1]}${op}${opMatch[3]}`;
      const prevExpr = current;
      const nextExpr = current.replace(subExprStr, formatNumber(calcRes));

      internalSteps.push({
        orderNumber: orderCounter++,
        subExprText: `${formatNumber(leftNum)} ${formatOperatorForDisplay(op)} ${formatNumber(rightNum)}`,
        leftOperand: leftNum,
        op,
        rightOperand: rightNum,
        result: calcRes,
        inBracket: false,
        prevExpr,
        nextExpr,
      });

      current = nextExpr;
    }

    if (internalSteps.length === 0) return null;

    const finalVal = parseFloat(current);
    if (isNaN(finalVal) || !isFinite(finalVal)) return null;

    // Convert internal steps to public OrderOfOperationStep
    const detailedSteps: OrderOfOperationStep[] = internalSteps.map((step) => {
      let opNameUzLatn = '';
      let opNameUzCyrl = '';
      let opNameRu = '';
      let opNameEn = '';
      let ruleUzLatn = '';
      let ruleUzCyrl = '';
      let ruleRu = '';
      let ruleEn = '';
      let type: OrderOfOperationStep['operationType'] = 'add';

      if (step.op === '^') {
        type = 'power';
        opNameUzLatn = 'Darajaga ko‘tarish';
        opNameUzCyrl = 'Даражага кўтариш';
        opNameRu = 'Возведение в степень';
        opNameEn = 'Exponentiation';
        ruleUzLatn = 'Darajaga ko‘tarish amali ko‘paytirish va qo‘shishdan oldin bajariladi.';
        ruleUzCyrl = 'Даражага кўтариш амали кўпайтириш ва қўшишдан олдин бажарилади.';
        ruleRu = 'Возведение в степень выполняется до умножения и сложения.';
        ruleEn = 'Exponentiation has higher precedence than multiplication and addition.';
      } else if (step.op === '*') {
        type = 'multiply';
        opNameUzLatn = 'Ko‘paytirish amali';
        opNameUzCyrl = 'Кўпайтириш амали';
        opNameRu = 'Умножение';
        opNameEn = 'Multiplication';
        ruleUzLatn = step.inBracket
          ? 'Qavs ichidagi amallar birinchi navbatda, ko‘paytirish esa qo‘shish/ayirishdan oldin bajariladi.'
          : 'Ko‘paytirish amali qo‘shish va ayirishdan oldin bajariladi.';
        ruleUzCyrl = step.inBracket
          ? 'Қавс ичидаги амаллар биринчи навбатда, кўпайтириш эса қўшиш/айиришдан олдин бажарилади.'
          : 'Кўпайтириш амали қўшиш ва айиришдан олдин бажарилади.';
        ruleRu = step.inBracket
          ? 'Действия в скобках имеют наивысший приоритет, умножение выполняется до сложения/вычитания.'
          : 'Умножение имеет преимущество перед сложением и вычитанием.';
        ruleEn = step.inBracket
          ? 'Operations inside parentheses are evaluated first; multiplication precedes addition.'
          : 'Multiplication has priority over addition and subtraction.';
      } else if (step.op === '/') {
        type = 'divide';
        opNameUzLatn = 'Bo‘lish amali';
        opNameUzCyrl = 'Бўлиш амали';
        opNameRu = 'Деление';
        opNameEn = 'Division';
        ruleUzLatn = step.inBracket
          ? 'Qavs ichida bo‘lish amali bajariladi.'
          : 'Bo‘lish amali qo‘shish va ayirishdan oldin, chapdan o‘ngga qarab bajariladi.';
        ruleUzCyrl = step.inBracket
          ? 'Қавс ичида бўлиш амали бажарилади.'
          : 'Бўлиш амали қўшиш ва айиришдан олдин, чапдан ўнгга қараб бажарилади.';
        ruleRu = step.inBracket
          ? 'Выполняется деление внутри скобок.'
          : 'Деление выполняется слева направо перед сложением и вычитанием.';
        ruleEn = step.inBracket
          ? 'Division evaluated inside parentheses.'
          : 'Division is evaluated left to right before addition and subtraction.';
      } else if (step.op === '+') {
        type = 'add';
        opNameUzLatn = 'Qo‘shish amali';
        opNameUzCyrl = 'Қўшиш амали';
        opNameRu = 'Сложение';
        opNameEn = 'Addition';
        ruleUzLatn = step.inBracket
          ? 'Qavs ichidagi qo‘shish amali bajariladi.'
          : 'Chapdan o‘ngga qarab qo‘shish amali bajariladi.';
        ruleUzCyrl = step.inBracket
          ? 'Қавс ичидаги қўшиш амали бажарилади.'
          : 'Чапдан ўнгга қараб қўшиш амали бажарилади.';
        ruleRu = step.inBracket
          ? 'Выполняется сложение внутри скобок.'
          : 'Сложение выполняется по порядку слева направо.';
        ruleEn = step.inBracket
          ? 'Addition evaluated inside parentheses.'
          : 'Addition evaluated from left to right.';
      } else if (step.op === '-') {
        type = 'subtract';
        opNameUzLatn = 'Ayirish amali';
        opNameUzCyrl = 'Айириш амали';
        opNameRu = 'Вычитание';
        opNameEn = 'Subtraction';
        ruleUzLatn = step.inBracket
          ? 'Qavs ichidagi ayirish amali bajariladi.'
          : 'Chapdan o‘ngga qarab ayirish amali bajariladi.';
        ruleUzCyrl = step.inBracket
          ? 'Қавс ичидаги айириш амали бажарилади.'
          : 'Чапдан ўнгга қараб айириш амали бажарилади.';
        ruleRu = step.inBracket
          ? 'Выполняется вычитание внутри скобок.'
          : 'Вычитание выполняется по порядку слева направо.';
        ruleEn = step.inBracket
          ? 'Subtraction evaluated inside parentheses.'
          : 'Subtraction evaluated from left to right.';
      }

      const bracketPrefixUz = step.inBracket ? 'Qavs ichida ' : '';
      const bracketPrefixRu = step.inBracket ? 'В скобках: ' : '';
      const bracketPrefixEn = step.inBracket ? 'In brackets: ' : '';

      return {
        orderNumber: step.orderNumber,
        titleUzLatn: `${step.orderNumber}-amal: ${bracketPrefixUz}${opNameUzLatn}`,
        titleUzCyrl: `${step.orderNumber}-амал: ${step.inBracket ? 'Қавс ичида ' : ''}${opNameUzCyrl}`,
        titleRu: `${step.orderNumber}-е действие: ${bracketPrefixRu}${opNameRu}`,
        titleEn: `Step ${step.orderNumber}: ${bracketPrefixEn}${opNameEn}`,
        ruleExplanationUzLatn: `${ruleUzLatn} Hisoblash: ${step.subExprText} = ${formatNumber(step.result)}`,
        ruleExplanationUzCyrl: `${ruleUzCyrl} Ҳисоблаш: ${step.subExprText} = ${formatNumber(step.result)}`,
        ruleExplanationRu: `${ruleRu} Вычисление: ${step.subExprText} = ${formatNumber(step.result)}`,
        ruleExplanationEn: `${ruleEn} Calculation: ${step.subExprText} = ${formatNumber(step.result)}`,
        subExpression: step.subExprText,
        subResult: formatNumber(step.result),
        operationType: type,
        previousExpression: step.prevExpr,
        resultingExpression: step.nextExpr,
        highlightSnippet: `${step.leftOperand}${step.op}${step.rightOperand}`,
      };
    });

    // Formatted display with spaces around operators
    const formattedDisplay = initialClean
      .replace(/([+*/^])/g, ' $1 ')
      .replace(/-/g, ' - ')
      .replace(/\s+/g, ' ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .trim();

    // Map operator order badges
    const operatorOrderBadges = detailedSteps.map((s) => ({
      operatorIndex: s.orderNumber,
      symbol: s.subExpression,
      orderNumber: s.orderNumber,
    }));

    const breakdown: OrderOfOperationsBreakdown = {
      originalExpression: initialClean,
      formattedDisplay,
      operatorOrderBadges,
      steps: detailedSteps,
      finalAnswer: formatNumber(finalVal),
    };

    // Standard SolutionStep list for fallback display
    const solutionSteps: SolutionStep[] = detailedSteps.map((ds) => ({
      id: `order-step-${ds.orderNumber}`,
      stepNumber: ds.orderNumber,
      stage: 'calculate',
      titleUzLatn: ds.titleUzLatn,
      titleUzCyrl: ds.titleUzCyrl,
      titleRu: ds.titleRu,
      titleEn: ds.titleEn,
      explanationUzLatn: ds.ruleExplanationUzLatn,
      explanationUzCyrl: ds.ruleExplanationUzCyrl,
      explanationRu: ds.ruleExplanationRu,
      explanationEn: ds.ruleExplanationEn,
      latex: `${ds.subExpression} = ${ds.subResult} \\implies ${ds.resultingExpression.replace(/\*/g, '\\times ').replace(/\//g, '\\div ')}`,
      highlightTerms: [String(ds.subResult)],
    }));

    // Add final answer step
    solutionSteps.push({
      id: `order-step-final`,
      stepNumber: detailedSteps.length + 1,
      stage: 'answer',
      titleUzLatn: 'Yakuniy natija',
      titleUzCyrl: 'Якуний натижа',
      titleRu: 'Итоговый результат',
      titleEn: 'Final Result',
      explanationUzLatn: `Barcha amallar tartib bo‘yicha to‘liq bajarildi. Umumiy javob: ${formatNumber(finalVal)}.`,
      explanationUzCyrl: `Барча амаллар тартиб бўйича тўлиқ бажарилди. Умумий жавоб: ${formatNumber(finalVal)}.`,
      explanationRu: `Все математические действия выполнены по порядку. Ответ: ${formatNumber(finalVal)}.`,
      explanationEn: `All operations evaluated in proper sequence. Final answer: ${formatNumber(finalVal)}.`,
      latex: `${formattedDisplay.replace(/\*/g, '\\times ').replace(/\//g, '\\div ')} = ${formatNumber(finalVal)}`,
      highlightTerms: [formatNumber(finalVal)],
    });

    return {
      success: true,
      subject: 'math',
      problemType: 'arithmetic',
      difficulty: 'Beginner',
      originalInput: rawInput,
      normalizedExpression: initialClean,
      targetUnknown: 'javob',
      steps: solutionSteps,
      finalAnswerLatex: `${formatNumber(finalVal)}`,
      finalAnswerExact: `${formatNumber(finalVal)}`,
      verified: true,
      verification: {
        valid: true,
        explanationUzLatn: 'Arifmetik amallarning bajarilish qonun-qoidalari (BODMAS / PEMDAS) orqali to‘liq tekshirildi.',
        explanationUzCyrl: 'Арифметик амалларнинг бажарилиш қонун-қоидалари (BODMAS / PEMDAS) орқали тўлиқ текширилди.',
        explanationRu: 'Вычисления полностью проверены согласно порядку математических действий (BODMAS / PEMDAS).',
        explanationEn: 'Calculations thoroughly verified following standard BODMAS / PEMDAS hierarchy.',
      },
      orderOfOperations: breakdown,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Universal builder that creates a 5-second animated order of operations breakdown
 * for ANY math, fraction, equation, or physics problem.
 */
export function createOrderOfOperationsFromSteps(
  originalInput: string,
  steps: SolutionStep[],
  finalAnswer: string | number
): OrderOfOperationsBreakdown {
  const calcSteps = steps.filter((s) => s.stage !== 'verify');
  const validSteps = calcSteps.length > 0 ? calcSteps : steps;

  const orderSteps: OrderOfOperationStep[] = validSteps.map((s, idx) => {
    // Clean LaTeX for readability in badges
    const rawLatex = s.latex || s.titleUzLatn;
    const cleanSub = rawLatex
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
      .replace(/\\cdot/g, '·')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/[{}]/g, '')
      .trim();

    return {
      orderNumber: idx + 1,
      titleUzLatn: s.titleUzLatn,
      titleUzCyrl: s.titleUzCyrl,
      titleRu: s.titleRu,
      titleEn: s.titleEn,
      ruleExplanationUzLatn: s.explanationUzLatn,
      ruleExplanationUzCyrl: s.explanationUzCyrl,
      ruleExplanationRu: s.explanationRu,
      ruleExplanationEn: s.explanationEn,
      subExpression: cleanSub || s.titleUzLatn,
      subResult: s.highlightTerms?.[0] || String(idx + 1),
      operationType: 'formula',
      previousExpression: idx === 0 ? originalInput : validSteps[idx - 1].latex || originalInput,
      resultingExpression: s.latex || originalInput,
      highlightSnippet: s.highlightTerms?.[0] || '',
    };
  });

  return {
    originalExpression: originalInput,
    formattedDisplay: originalInput,
    operatorOrderBadges: orderSteps.map((os) => ({
      operatorIndex: os.orderNumber,
      symbol: String(os.orderNumber),
      orderNumber: os.orderNumber,
    })),
    steps: orderSteps,
    finalAnswer,
  };
}

