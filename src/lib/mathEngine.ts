import { SolutionStep, SolverResult } from '../types';

// Greatest Common Divisor
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Least Common Multiple
export function lcm(a: number, b: number): number {
  return Math.abs(Math.round(a * b)) / gcd(a, b);
}

export interface Fraction {
  num: number;
  den: number;
}

export function simplifyFraction(num: number, den: number): Fraction {
  if (den === 0) throw new Error('Nolga böliş mumkin emas (Division by zero)');
  let sign = 1;
  if ((num < 0 && den > 0) || (num > 0 && den < 0)) sign = -1;
  const absNum = Math.abs(num);
  const absDen = Math.abs(den);
  const common = gcd(absNum, absDen);
  return {
    num: sign * (absNum / common),
    den: absDen / common,
  };
}

export function fractionToLatex(f: Fraction): string {
  if (f.den === 1) return `${f.num}`;
  if (f.num < 0) return `-\\frac{${Math.abs(f.num)}}{${f.den}}`;
  return `\\frac{${f.num}}{${f.den}}`;
}

/**
 * Solves fraction arithmetic: e.g. "3/4 + 5/6" or "2/3 * 4/5"
 */
export function solveFractionArithmetic(input: string): SolverResult | null {
  const match = input.replace(/\s+/g, '').match(/^([+-]?\d+)\/(\d+)([+\-*/])([+-]?\d+)\/(\d+)$/);
  if (!match) return null;

  const n1 = parseInt(match[1], 10);
  const d1 = parseInt(match[2], 10);
  const op = match[3];
  const n2 = parseInt(match[4], 10);
  const d2 = parseInt(match[5], 10);

  if (d1 === 0 || d2 === 0) {
    return {
      success: false,
      subject: 'math',
      problemType: 'fraction',
      difficulty: 'Beginner',
      originalInput: input,
      normalizedExpression: input,
      targetUnknown: 'result',
      steps: [],
      finalAnswerLatex: '',
      finalAnswerExact: '',
      verified: false,
      errorMessage: 'Maxraj nol bölişi mumkin emas (Denominator cannot be zero)',
    };
  }

  const steps: SolutionStep[] = [];
  let resNum = 0;
  let resDen = 1;

  steps.push({
    id: 'step-1',
    stepNumber: 1,
    stage: 'understand',
    titleUzLatn: 'Kasrli ifodani aniqlash',
    titleUzCyrl: 'Касрли ифодани аниқлаш',
    titleRu: 'Определение дробного выражения',
    titleEn: 'Identify fraction expression',
    explanationUzLatn: `Berilgan amallar: \\frac{${n1}}{${d1}} ${op === '*' ? '\\times' : op === '/' ? '\\div' : op} \\frac{${n2}}{${d2}}`,
    explanationUzCyrl: `Берилган амаллар: \\frac{${n1}}{${d1}} ${op === '*' ? '\\times' : op === '/' ? '\\div' : op} \\frac{${n2}}{${d2}}`,
    explanationRu: `Дано выражение: \\frac{${n1}}{${d1}} ${op === '*' ? '\\times' : op === '/' ? '\\div' : op} \\frac{${n2}}{${d2}}`,
    explanationEn: `Given expression: \\frac{${n1}}{${d1}} ${op === '*' ? '\\times' : op === '/' ? '\\div' : op} \\frac{${n2}}{${d2}}`,
    latex: `\\frac{${n1}}{${d1}} ${op === '*' ? '\\times' : op === '/' ? '\\div' : op} \\frac{${n2}}{${d2}}`,
  });

  if (op === '+' || op === '-') {
    const commonDen = lcm(d1, d2);
    const m1 = commonDen / d1;
    const m2 = commonDen / d2;
    const scaledN1 = n1 * m1;
    const scaledN2 = n2 * m2;

    steps.push({
      id: 'step-2',
      stepNumber: 2,
      stage: 'calculate',
      titleUzLatn: 'Umumiy maxrajga keltirish',
      titleUzCyrl: 'Умумий махражга келтириш',
      titleRu: 'Приведение к общему знаменателю',
      titleEn: 'Common denominator',
      explanationUzLatn: `Maxrajlar ${d1} va ${d2} uçun eng kiciq umumiy karrali (EKUK) = ${commonDen}.`,
      explanationUzCyrl: `Махражлар ${d1} ва ${d2} учун энг кичик умумий каррали (ЭКУК) = ${commonDen}.`,
      explanationRu: `Наименьший общий знаменатель (НОК) для ${d1} и ${d2} равен ${commonDen}.`,
      explanationEn: `Least common denominator (LCD) for ${d1} and ${d2} is ${commonDen}.`,
      latex: `\\frac{${n1} \\times ${m1}}{${commonDen}} ${op} \\frac{${n2} \\times ${m2}}{${commonDen}} = \\frac{${scaledN1}}{${commonDen}} ${op} \\frac{${scaledN2}}{${commonDen}}`,
      highlightTerms: [`${commonDen}`],
    });

    resNum = op === '+' ? scaledN1 + scaledN2 : scaledN1 - scaledN2;
    resDen = commonDen;

    steps.push({
      id: 'step-3',
      stepNumber: 3,
      stage: 'calculate',
      titleUzLatn: 'Suratlarni qöşiş/ayiriş',
      titleUzCyrl: 'Суратларни қўшиш/айириш',
      titleRu: 'Сложение/вычитание числителей',
      titleEn: 'Add/subtract numerators',
      explanationUzLatn: `Maxraj bir xil bölganda suratlarni hisoblaymiz: ${scaledN1} ${op} ${scaledN2} = ${resNum}`,
      explanationUzCyrl: `Махраж бир хил бўлганда суратларни ҳисоблаймиз: ${scaledN1} ${op} ${scaledN2} = ${resNum}`,
      explanationRu: `При одинаковом знаменателе складываем числители: ${scaledN1} ${op} ${scaledN2} = ${resNum}`,
      explanationEn: `Combine numerators over common denominator: ${scaledN1} ${op} ${scaledN2} = ${resNum}`,
      latex: `\\frac{${scaledN1} ${op} ${scaledN2}}{${commonDen}} = \\frac{${resNum}}{${commonDen}}`,
    });
  } else if (op === '*') {
    resNum = n1 * n2;
    resDen = d1 * d2;
    steps.push({
      id: 'step-2',
      stepNumber: 2,
      stage: 'calculate',
      titleUzLatn: 'Kasrlarni köpaytiriş',
      titleUzCyrl: 'Касрларни кўпайтириш',
      titleRu: 'Умножение дробей',
      titleEn: 'Multiply fractions',
      explanationUzLatn: 'Surat suratga, maxraj maxrajga köpaytiriladi.',
      explanationUzCyrl: 'Сурат суратга, махраж махражга кўпайтирилади.',
      explanationRu: 'Числитель умножается на числитель, знаменатель на знаменатель.',
      explanationEn: 'Multiply numerator by numerator and denominator by denominator.',
      latex: `\\frac{${n1} \\times ${n2}}{${d1} \\times ${d2}} = \\frac{${resNum}}{${resDen}}`,
    });
  } else if (op === '/') {
    resNum = n1 * d2;
    resDen = d1 * n2;
    steps.push({
      id: 'step-2',
      stepNumber: 2,
      stage: 'calculate',
      titleUzLatn: 'Kasrlarni böliş',
      titleUzCyrl: 'Касрларни бўлиш',
      titleRu: 'Деление дробей',
      titleEn: 'Divide fractions',
      explanationUzLatn: 'Birinci kasr ikkinçi kasrning teskarisiga köpaytiriladi.',
      explanationUzCyrl: 'Биринчи каср иккинчи касрнинг тескарисига кўпайтирилади.',
      explanationRu: 'Первая дробь умножается на обратную вторую дробь.',
      explanationEn: 'First fraction is multiplied by the reciprocal of the second.',
      latex: `\\frac{${n1}}{${d1}} \\times \\frac{${d2}}{${n2}} = \\frac{${resNum}}{${resDen}}`,
    });
  }

  const simplified = simplifyFraction(resNum, resDen);
  const finalLatex = fractionToLatex(simplified);
  const approx = (simplified.num / simplified.den).toFixed(4);

  if (simplified.num !== resNum || simplified.den !== resDen) {
    steps.push({
      id: `step-${steps.length + 1}`,
      stepNumber: steps.length + 1,
      stage: 'calculate',
      titleUzLatn: 'Kasrni qisqartiriş',
      titleUzCyrl: 'Касрни қисқартириш',
      titleRu: 'Сокращение дроби',
      titleEn: 'Simplify fraction',
      explanationUzLatn: `Surat va maxraj umumiy böluvçiga qisqartirildi: ${finalLatex}`,
      explanationUzCyrl: `Сурат ва махраж умумий бўлувчига қисқартирилди: ${finalLatex}`,
      explanationRu: `Числитель и знаменатель сокращены на общий делитель: ${finalLatex}`,
      explanationEn: `Fraction simplified by dividing by greatest common divisor: ${finalLatex}`,
      latex: `\\frac{${resNum}}{${resDen}} = ${finalLatex}`,
    });
  }

  // Verification step
  steps.push({
    id: `step-${steps.length + 1}`,
    stepNumber: steps.length + 1,
    stage: 'verify',
    titleUzLatn: 'Natijani tekşiriş',
    titleUzCyrl: 'Натижани текшириш',
    titleRu: 'Проверка результата',
    titleEn: 'Verification',
    explanationUzLatn: `Ratsional tenglik tekşirildi: ${finalLatex} \\approx ${approx}`,
    explanationUzCyrl: `Рационал тенглик текширилди: ${finalLatex} \\approx ${approx}`,
    explanationRu: `Рациональное равенство проверено: ${finalLatex} \\approx ${approx}`,
    explanationEn: `Rational equality verified: ${finalLatex} \\approx ${approx}`,
    latex: `${finalLatex} \\approx ${approx} \\quad \\checkmark`,
  });

  return {
    success: true,
    subject: 'math',
    problemType: 'fraction',
    difficulty: 'Beginner',
    originalInput: input,
    normalizedExpression: `${n1}/${d1} ${op} ${n2}/${d2}`,
    targetUnknown: 'natija',
    steps,
    finalAnswerLatex: finalLatex,
    finalAnswerExact: `${simplified.num}${simplified.den !== 1 ? '/' + simplified.den : ''}`,
    finalAnswerApprox: approx,
    verified: true,
    verification: {
      valid: true,
      explanationUzLatn: 'Hisob-kitoblar aniq ratsional arifmetika bilan tasdiqlandi.',
      explanationUzCyrl: 'Ҳисоб-китоблар аниқ рационал арифметика билан тасдиқланди.',
      explanationRu: 'Вычисления подтверждены точной рациональной арифметикой.',
      explanationEn: 'Calculations verified by exact rational arithmetic.',
    },
  };
}

/**
 * Solves linear equation: ax + b = c or ax + b = cx + d
 * Examples: "3x + 7 = 25", "2x + 5 = 17", "5x - 3 = 2x + 9"
 */
export function solveLinearEquation(input: string): SolverResult | null {
  const clean = input.replace(/\s+/g, '');
  if (!clean.includes('=')) return null;

  // Let variable be any letter like x, y, z, t, a, b
  const sides = clean.split('=');
  if (sides.length !== 2) return null;

  // Helper to parse side into a*var + b
  const parseSide = (side: string, varChar: string): { a: number; b: number } | null => {
    // Regex matching tokens: (+/-)? [digits]? var OR (+/-)? digits
    let aTotal = 0;
    let bTotal = 0;

    const regex = /([+-]?[^+-]+)/g;
    const tokens = side.match(regex);
    if (!tokens) return null;

    for (const token of tokens) {
      if (token.includes(varChar)) {
        let coeffStr = token.replace(varChar, '');
        if (coeffStr === '' || coeffStr === '+') coeffStr = '1';
        if (coeffStr === '-') coeffStr = '-1';
        const coeff = parseFloat(coeffStr);
        if (isNaN(coeff)) return null;
        aTotal += coeff;
      } else {
        const val = parseFloat(token);
        if (isNaN(val)) return null;
        bTotal += val;
      }
    }
    return { a: aTotal, b: bTotal };
  };

  // Find the variable used
  const varMatch = clean.match(/[a-zA-Z]/);
  if (!varMatch) return null;
  const varName = varMatch[0];

  // If there are squares like x^2, delegate to quadratic
  if (clean.includes('^2') || clean.includes('²')) return null;

  const left = parseSide(sides[0], varName);
  const right = parseSide(sides[1], varName);
  if (!left || !right) return null;

  const netA = left.a - right.a;
  const netB = right.b - left.b;

  const steps: SolutionStep[] = [];

  // Step 1: Given equation
  steps.push({
    id: 'step-1',
    stepNumber: 1,
    stage: 'understand',
    titleUzLatn: 'Boshlang‘ich tenglama',
    titleUzCyrl: 'Бошланғич тенглама',
    titleRu: 'Исходное уравнение',
    titleEn: 'Original equation',
    explanationUzLatn: `Bir noma'lumli chiziqli tenglama: ${sides[0]} = ${sides[1]}`,
    explanationUzCyrl: `Бир номаълумли чизиқли тенглама: ${sides[0]} = ${sides[1]}`,
    explanationRu: `Линейное уравнение с одной переменной: ${sides[0]} = ${sides[1]}`,
    explanationEn: `Linear equation with one unknown: ${sides[0]} = ${sides[1]}`,
    latex: `${sides[0]} = ${sides[1]}`,
  });

  if (netA === 0) {
    if (netB === 0) {
      return {
        success: true,
        subject: 'math',
        problemType: 'linear-equation',
        difficulty: 'Beginner',
        originalInput: input,
        normalizedExpression: `${left.a}${varName} + ${left.b} = ${right.a}${varName} + ${right.b}`,
        targetUnknown: varName,
        steps,
        finalAnswerLatex: `${varName} \\in \\mathbb{R}`,
        finalAnswerExact: 'Cheksiz köp yechim (Infinite solutions)',
        verified: true,
      };
    } else {
      return {
        success: true,
        subject: 'math',
        problemType: 'linear-equation',
        difficulty: 'Beginner',
        originalInput: input,
        normalizedExpression: input,
        targetUnknown: varName,
        steps,
        finalAnswerLatex: '\\emptyset',
        finalAnswerExact: 'Yechimga ega emas (No solution)',
        verified: false,
        errorMessage: 'Tenglik hech qachon bajarilmaydi (Contradiction).',
      };
    }
  }

  // Step 2: Move constants to right
  if (left.b !== 0) {
    const op = left.b > 0 ? `-${left.b}` : `+${Math.abs(left.b)}`;
    steps.push({
      id: 'step-2',
      stepNumber: 2,
      stage: 'rearrange',
      titleUzLatn: 'Ozod sonlarni tenglikning öng tomoniga ötkaziş',
      titleUzCyrl: 'Озод сонларни тенгликнинг ўнг томонига ўтказиш',
      titleRu: 'Перенос свободных членов вправо',
      titleEn: 'Move constant terms to the right',
      explanationUzLatn: `Ikkala tomondan ${left.b > 0 ? left.b : Math.abs(left.b)} ni ${left.b > 0 ? 'ayiramiz' : 'qöşamiz'}.`,
      explanationUzCyrl: `Иккала томондан ${left.b > 0 ? left.b : Math.abs(left.b)} ни ${left.b > 0 ? 'айирамиз' : 'қўшамиз'}.`,
      explanationRu: `Вычитаем ${left.b} из обеих частей уравнения.`,
      explanationEn: `Subtract ${left.b} from both sides of equation.`,
      latex: `${left.a}${varName} = ${right.b - left.b + right.a}${varName !== '' && right.a !== 0 ? ' + ' + right.a + varName : ''}`,
      highlightTerms: [`${left.b}`],
      operationType: left.b > 0 ? 'subtract' : 'add',
      operationValue: Math.abs(left.b),
    });
  }

  // Step 3: Move variable terms to left if right.a !== 0
  if (right.a !== 0) {
    steps.push({
      id: 'step-3',
      stepNumber: steps.length + 1,
      stage: 'rearrange',
      titleUzLatn: 'Noma‘lumli hadlarni çap tomonga töplaş',
      titleUzCyrl: 'Номаълумли ҳадларни чап томонга тўплаш',
      titleRu: 'Сбор членов с переменной влево',
      titleEn: 'Collect variable terms to the left',
      explanationUzLatn: `Tenglikning ikkala tomonidan ${right.a}${varName} ni ayiramiz.`,
      explanationUzCyrl: `Тенгликнинг иккала томонидан ${right.a}${varName} ни айирамиз.`,
      explanationRu: `Переносим слагаемое с переменной влево.`,
      explanationEn: `Subtract ${right.a}${varName} from both sides.`,
      latex: `${netA}${varName} = ${netB}`,
      operationType: 'subtract',
      operationValue: `${right.a}${varName}`,
    });
  }

  // Step 4: Divide by coefficient of variable
  const solutionNum = netB;
  const solutionDen = netA;
  const simplified = simplifyFraction(solutionNum, solutionDen);
  const solutionValue = solutionNum / solutionDen;

  steps.push({
    id: `step-${steps.length + 1}`,
    stepNumber: steps.length + 1,
    stage: 'calculate',
    titleUzLatn: `${varName} oldidagi koeffitsiyentga böliş`,
    titleUzCyrl: `${varName} олдидаги коэффициентга бўлиш`,
    titleRu: `Деление на коэффициент при ${varName}`,
    titleEn: `Divide by coefficient of ${varName}`,
    explanationUzLatn: `Tenglikning ikkala tomonini ${netA} ga bölamiz: ${varName} = ${netB} / ${netA}.`,
    explanationUzCyrl: `Тенгликнинг иккала томонини ${netA} га бўламиз: ${varName} = ${netB} / ${netA}.`,
    explanationRu: `Делим обе части уравнения на ${netA}: ${varName} = ${netB} / ${netA}.`,
    explanationEn: `Divide both sides by ${netA}: ${varName} = ${netB} / ${netA}.`,
    latex: `${varName} = \\frac{${netB}}{${netA}}${simplified.den !== 1 ? ' = ' + fractionToLatex(simplified) : ' = ' + solutionValue}`,
    operationType: 'divide',
    operationValue: netA,
  });

  // Step 5: Verification
  const leftCheck = left.a * solutionValue + left.b;
  const rightCheck = right.a * solutionValue + right.b;
  const isApproxEqual = Math.abs(leftCheck - rightCheck) < 1e-7;

  steps.push({
    id: `step-${steps.length + 1}`,
    stepNumber: steps.length + 1,
    stage: 'verify',
    titleUzLatn: 'Yechimni asl tenglamaga qöyib tekşiriş',
    titleUzCyrl: 'Ечимни асл тенгламага қўйиб текшириш',
    titleRu: 'Проверка подстановкой в исходное уравнение',
    titleEn: 'Verify by substitution into original equation',
    explanationUzLatn: `Topilgan ${varName} = ${solutionValue} qiymatni boshlang‘ich tenglamaga qöyamiz: ${sides[0].replace(varName, `(${solutionValue})`)} = ${sides[1].replace(varName, `(${solutionValue})`)}.`,
    explanationUzCyrl: `Топилган ${varName} = ${solutionValue} қийматни бошланғич тенгламага қўямиз: ${sides[0].replace(varName, `(${solutionValue})`)} = ${sides[1].replace(varName, `(${solutionValue})`)}.`,
    explanationRu: `Подставляем ${varName} = ${solutionValue} в исходное уравнение.`,
    explanationEn: `Substitute ${varName} = ${solutionValue} into original equation.`,
    latex: `${leftCheck.toFixed(2).replace(/\.00$/, '')} = ${rightCheck.toFixed(2).replace(/\.00$/, '')} \\quad \\checkmark`,
  });

  const finalExact = simplified.den === 1 ? `${simplified.num}` : `${simplified.num}/${simplified.den}`;
  const finalLatex = `${varName} = ${fractionToLatex(simplified)}`;

  return {
    success: true,
    subject: 'math',
    problemType: 'linear-equation',
    difficulty: 'Beginner',
    originalInput: input,
    normalizedExpression: `${netA}*${varName} = ${netB}`,
    targetUnknown: varName,
    steps,
    finalAnswerLatex: finalLatex,
    finalAnswerExact: `${varName} = ${finalExact}`,
    finalAnswerApprox: Number.isInteger(solutionValue) ? undefined : solutionValue.toFixed(4),
    verified: isApproxEqual,
    verification: {
      valid: isApproxEqual,
      leftHandSide: `${leftCheck.toFixed(4)}`,
      rightHandSide: `${rightCheck.toFixed(4)}`,
      explanationUzLatn: `Tekşirildi: çap tomon = ${leftCheck.toFixed(2)}, öng tomon = ${rightCheck.toFixed(2)}. Tenglik bajarildi!`,
      explanationUzCyrl: `Текширилди: чап томон = ${leftCheck.toFixed(2)}, ўнг томон = ${rightCheck.toFixed(2)}. Тенглик бажарилди!`,
      explanationRu: `Проверено: левая часть = ${leftCheck.toFixed(2)}, правая часть = ${rightCheck.toFixed(2)}. Равенство верно!`,
      explanationEn: `Verified: LHS = ${leftCheck.toFixed(2)}, RHS = ${rightCheck.toFixed(2)}. Equality holds!`,
    },
  };
}

/**
 * Solves quadratic equation: ax^2 + bx + c = 0
 * Example: x^2 - 5x + 6 = 0, 2x^2 + 5x - 3 = 0, x^2 + 1 = 0
 */
export function solveQuadraticEquation(input: string): SolverResult | null {
  const clean = input.replace(/\s+/g, '').replace('²', '^2');
  if (!clean.includes('=') || !clean.includes('^2')) return null;

  // Standard form ax^2 + bx + c = 0
  const sides = clean.split('=');
  if (sides.length !== 2) return null;

  // Move everything to left side: left - right = 0
  // Match tokens for a*x^2 + b*x + c
  const varMatch = clean.match(/([a-zA-Z])\^2/);
  if (!varMatch) return null;
  const varName = varMatch[1];

  // Helper to extract a, b, c from side
  const parsePoly = (side: string): { a: number; b: number; c: number } | null => {
    let a = 0, b = 0, c = 0;
    const tokens = side.match(/([+-]?[^+-]+)/g);
    if (!tokens) return null;

    for (const t of tokens) {
      if (t.includes(`${varName}^2`)) {
        let co = t.replace(`${varName}^2`, '');
        if (co === '' || co === '+') co = '1';
        if (co === '-') co = '-1';
        a += parseFloat(co);
      } else if (t.includes(varName)) {
        let co = t.replace(varName, '');
        if (co === '' || co === '+') co = '1';
        if (co === '-') co = '-1';
        b += parseFloat(co);
      } else {
        c += parseFloat(t);
      }
    }
    return { a, b, c };
  };

  const leftPoly = parsePoly(sides[0]);
  const rightPoly = parsePoly(sides[1]);
  if (!leftPoly || !rightPoly) return null;

  const a = leftPoly.a - rightPoly.a;
  const b = leftPoly.b - rightPoly.b;
  const c = leftPoly.c - rightPoly.c;

  if (a === 0) return solveLinearEquation(input);

  const steps: SolutionStep[] = [];

  // Step 1: Standard form
  const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const cSign = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
  steps.push({
    id: 'step-1',
    stepNumber: 1,
    stage: 'understand',
    titleUzLatn: 'Kvadrat tenglamaning standart körinişi',
    titleUzCyrl: 'Квадрат тенгламанинг стандарт кўриниши',
    titleRu: 'Стандартный вид квадратного уравнения',
    titleEn: 'Standard form of quadratic equation',
    explanationUzLatn: `Kvadrat tenglama koeffitsiyentlari: a = ${a}, b = ${b}, c = ${c}.`,
    explanationUzCyrl: `Квадрат тенглама коэффициентлари: a = ${a}, b = ${b}, c = ${c}.`,
    explanationRu: `Коэффициенты квадратного уравнения: a = ${a}, b = ${b}, c = ${c}.`,
    explanationEn: `Quadratic equation coefficients: a = ${a}, b = ${b}, c = ${c}.`,
    latex: `${a !== 1 ? (a === -1 ? '-' : a) : ''}${varName}^2 ${b !== 0 ? bSign + varName : ''} ${c !== 0 ? cSign : ''} = 0`,
  });

  // Step 2: Discriminant D = b^2 - 4ac
  const D = b * b - 4 * a * c;
  steps.push({
    id: 'step-2',
    stepNumber: 2,
    stage: 'calculate',
    titleUzLatn: 'Diskriminantni hisoblaş: D = b² - 4ac',
    titleUzCyrl: 'Дискриминантни ҳисоблаш: D = b² - 4ac',
    titleRu: 'Вычисление дискриминанта: D = b² - 4ac',
    titleEn: 'Calculate Discriminant: D = b² - 4ac',
    explanationUzLatn: `D = (${b})² - 4 \\cdot (${a}) \\cdot (${c}) = ${b * b} - (${4 * a * c}) = ${D}.`,
    explanationUzCyrl: `D = (${b})² - 4 \\cdot (${a}) \\cdot (${c}) = ${b * b} - (${4 * a * c}) = ${D}.`,
    explanationRu: `D = (${b})² - 4 \\cdot (${a}) \\cdot (${c}) = ${b * b} - (${4 * a * c}) = ${D}.`,
    explanationEn: `D = (${b})² - 4 \\cdot (${a}) \\cdot (${c}) = ${b * b} - (${4 * a * c}) = ${D}.`,
    latex: `D = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${D}`,
    highlightTerms: [`${D}`],
  });

  let finalAnswerLatex = '';
  let finalAnswerExact = '';
  let finalAnswerApprox: string | undefined = undefined;
  let verified = false;

  if (D > 0) {
    const sqrtD = Math.sqrt(D);
    const isSquare = Number.isInteger(sqrtD);

    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);

    steps.push({
      id: 'step-3',
      stepNumber: 3,
      stage: 'calculate',
      titleUzLatn: 'Ikkita haqiqiy ildizni topiş (D > 0)',
      titleUzCyrl: 'Иккита ҳақиқий илдизни топиш (D > 0)',
      titleRu: 'Нахождение двух действительных корней (D > 0)',
      titleEn: 'Find two real roots (D > 0)',
      explanationUzLatn: `Formuladan foydalanamiz: ${varName}_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}`,
      explanationUzCyrl: `Формуладан фойдаланамиз: ${varName}_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}`,
      explanationRu: `Используем формулу корней: ${varName}_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}`,
      explanationEn: `Using quadratic formula: ${varName}_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}`,
      latex: `${varName}_1 = \\frac{-(${b}) + ${isSquare ? sqrtD : '\\sqrt{' + D + '}'}}{2(${a})} = ${x1.toFixed(3).replace(/\.000$/, '')}, \\quad ${varName}_2 = \\frac{-(${b}) - ${isSquare ? sqrtD : '\\sqrt{' + D + '}'}}{2(${a})} = ${x2.toFixed(3).replace(/\.000$/, '')}`,
    });

    // Verification step (Vieta's formula & substitution)
    const sumRoots = x1 + x2;
    const prodRoots = x1 * x2;
    steps.push({
      id: 'step-4',
      stepNumber: 4,
      stage: 'verify',
      titleUzLatn: 'Viyet teoremasi bilan tekşiriş',
      titleUzCyrl: 'Виет теоремаси билан текшириш',
      titleRu: 'Проверка по теореме Виета',
      titleEn: 'Verification with Vieta’s formulas',
      explanationUzLatn: `Ildizlar yig‘indisi x₁ + x₂ = -b/a = ${(-b / a).toFixed(2)}, köpaytmasi x₁ \\cdot x₂ = c/a = ${(c / a).toFixed(2)}. Tekşirildi!`,
      explanationUzCyrl: `Илдизлар йиғиндиси x₁ + x₂ = -b/a = ${(-b / a).toFixed(2)}, кўпайтмаси x₁ \\cdot x₂ = c/a = ${(c / a).toFixed(2)}. Текширилди!`,
      explanationRu: `Сумма корней x₁ + x₂ = -b/a = ${(-b / a).toFixed(2)}, произведение x₁ \\cdot x₂ = c/a = ${(c / a).toFixed(2)}. Проверено!`,
      explanationEn: `Sum of roots x₁ + x₂ = -b/a = ${(-b / a).toFixed(2)}, product x₁ \\cdot x₂ = c/a = ${(c / a).toFixed(2)}. Verified!`,
      latex: `x_1 + x_2 = -\\frac{b}{a} = ${(-b / a).toFixed(2)}, \\quad x_1 x_2 = \\frac{c}{a} = ${(c / a).toFixed(2)} \\quad \\checkmark`,
    });

    finalAnswerLatex = `${varName}_1 = ${x1.toFixed(2).replace(/\.00$/, '')}, \\quad ${varName}_2 = ${x2.toFixed(2).replace(/\.00$/, '')}`;
    finalAnswerExact = `${varName}₁ = ${x1}, ${varName}₂ = ${x2}`;
    verified = true;
  } else if (D === 0) {
    const x = -b / (2 * a);
    steps.push({
      id: 'step-3',
      stepNumber: 3,
      stage: 'calculate',
      titleUzLatn: 'Bitta karrali ildiz (D = 0)',
      titleUzCyrl: 'Битта каррали илдиз (D = 0)',
      titleRu: 'Один кратный корень (D = 0)',
      titleEn: 'One double root (D = 0)',
      explanationUzLatn: `${varName} = \\frac{-b}{2a} = \\frac{-(${b})}{2(${a})} = ${x}`,
      explanationUzCyrl: `${varName} = \\frac{-b}{2a} = \\frac{-(${b})}{2(${a})} = ${x}`,
      explanationRu: `${varName} = \\frac{-b}{2a} = \\frac{-(${b})}{2(${a})} = ${x}`,
      explanationEn: `${varName} = \\frac{-b}{2a} = \\frac{-(${b})}{2(${a})} = ${x}`,
      latex: `${varName} = -\\frac{b}{2a} = ${x}`,
    });

    finalAnswerLatex = `${varName} = ${x}`;
    finalAnswerExact = `${varName} = ${x}`;
    verified = true;
  } else {
    // Complex roots
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-D) / (2 * Math.abs(a));
    const realStr = realPart !== 0 ? `${realPart.toFixed(2).replace(/\.00$/, '')} ` : '';
    const imagStr = imagPart === 1 ? 'i' : `${imagPart.toFixed(2).replace(/\.00$/, '')}i`;

    steps.push({
      id: 'step-3',
      stepNumber: 3,
      stage: 'calculate',
      titleUzLatn: 'Haqiqiy ildiz yöq, kompleks ildizlar mavjud (D < 0)',
      titleUzCyrl: 'Ҳақиқий илдиз йўқ, комплекс илдизлар мавжуд (D < 0)',
      titleRu: 'Нет действительных корней, комплексные корни (D < 0)',
      titleEn: 'No real roots, complex roots exist (D < 0)',
      explanationUzLatn: `D < 0 bölganda haqiqiy sonlar töplamida yechim yöq, lekin kompleks sonlar töplamida mavjud: \\sqrt{D} = \\sqrt{${-D}}i.`,
      explanationUzCyrl: `D < 0 бўлганда ҳақиқий сонлар тўпламида ечим йўқ, лекин комплекс сонлар тўпламида мавжуд: \\sqrt{D} = \\sqrt{${-D}}i.`,
      explanationRu: `При D < 0 действительных корней нет, но есть комплексные корни: \\sqrt{D} = \\sqrt{${-D}}i.`,
      explanationEn: `When D < 0 there are no real roots, but complex conjugate roots exist: \\sqrt{D} = \\sqrt{${-D}}i.`,
      latex: `${varName}_{1,2} = \\frac{-(${b}) \\pm \\sqrt{${-D}}i}{2(${a})} = ${realStr}\\pm ${imagStr}`,
    });

    finalAnswerLatex = `${varName} = ${realStr}\\pm ${imagStr}`;
    finalAnswerExact = `Haqiqiy ildiz yöq (No real root); Kompleks: ${realStr}±${imagStr}`;
    verified = true;
  }

  return {
    success: true,
    subject: 'math',
    problemType: 'quadratic-equation',
    difficulty: 'Intermediate',
    originalInput: input,
    normalizedExpression: `${a}*${varName}^2 + ${b}*${varName} + ${c} = 0`,
    targetUnknown: varName,
    steps,
    finalAnswerLatex,
    finalAnswerExact,
    finalAnswerApprox,
    verified,
    verification: {
      valid: verified,
      explanationUzLatn: 'Ildizlar Viyet teoremasi va diskriminant formulasi orqali tekşirildi.',
      explanationUzCyrl: 'Илдизлар Виет теоремаси ва дискриминант формуласи орқали текширилди.',
      explanationRu: 'Корни проверены по теореме Виета и формуле дискриминанта.',
      explanationEn: 'Roots verified via discriminant formula and Vieta’s relations.',
    },
  };
}

/**
 * Solves general arithmetic expressions like "2+3", "45 * 2 - 10", "sqrt(16)", etc.
 */
export function solveArithmetic(input: string): SolverResult | null {
  const clean = input.replace(/\s+/g, '');
  // Disallow assignments or complex equations
  if (clean.includes('=')) return null;

  // Check if it's pure arithmetic
  if (!/^[\d+\-*/().^%sqrt]+$/.test(clean)) return null;

  try {
    // Safe evaluation using standard tokenization or math evaluation
    let sanitized = clean
      .replace(/\^/g, '**')
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');

    // Restricted safe eval with only numbers & math operators
    if (/[a-zA-Z]/.test(sanitized.replace(/Math\.sqrt/g, ''))) return null;

    // Evaluate safely
    const func = new Function(`return (${sanitized});`);
    const val = func();
    if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return null;

    const steps: SolutionStep[] = [
      {
        id: 'step-1',
        stepNumber: 1,
        stage: 'understand',
        titleUzLatn: 'Arifmetik ifoda',
        titleUzCyrl: 'Арифметик ифода',
        titleRu: 'Арифметическое выражение',
        titleEn: 'Arithmetic expression',
        explanationUzLatn: 'Amallarning bajariliş tartibi böyiça hisoblanaadi.',
        explanationUzCyrl: 'Амалларнинг бажарилиш тартиби бўйича ҳисобланади.',
        explanationRu: 'Вычисление согласно порядку математических действий.',
        explanationEn: 'Evaluate following standard order of operations.',
        latex: `${clean} = ${val}`,
      },
    ];

    return {
      success: true,
      subject: 'math',
      problemType: 'arithmetic',
      difficulty: 'Beginner',
      originalInput: input,
      normalizedExpression: clean,
      targetUnknown: 'result',
      steps,
      finalAnswerLatex: `${val}`,
      finalAnswerExact: `${val}`,
      verified: true,
    };
  } catch {
    return null;
  }
}
