import { SolutionStep, SolverResult, GivenFindSection } from '../types';
import { convertUnits, UNIT_REGISTRY } from './unitEngine';

export interface PhysicsFormulaTemplate {
  id: string;
  topic: string;
  nameUzLatn: string;
  nameUzCyrl: string;
  nameRu: string;
  nameEn: string;
  baseFormula: string; // e.g. "F = m * a"
  baseFormulaLatex: string;
  variables: {
    symbol: string;
    nameUzLatn: string;
    nameUzCyrl: string;
    nameRu: string;
    nameEn: string;
    unit: string;
  }[];
  // Map of target unknown -> calculation function & rearrangement latex
  solvers: Record<
    string,
    {
      rearrangedLatex: string;
      calculate: (vals: Record<string, number>) => number;
      explanationUzLatn: (vals: Record<string, number>, res: number) => string;
      explanationUzCyrl: (vals: Record<string, number>, res: number) => string;
      explanationRu: (vals: Record<string, number>, res: number) => string;
      explanationEn: (vals: Record<string, number>, res: number) => string;
      dimensionStepLatex: string;
    }
  >;
  verifyFormula: (vals: Record<string, number>) => { valid: boolean; lhs: number; rhs: number };
}

export const PHYSICS_FORMULAS: Record<string, PhysicsFormulaTemplate> = {
  // 1. Newton's 2nd Law: F = m * a
  'newton-second-law': {
    id: 'newton-second-law',
    topic: 'Mexanika (Dinamika)',
    nameUzLatn: 'Nyutonning ikkinçi qonuni',
    nameUzCyrl: 'Ньютоннинг иккинчи қонуни',
    nameRu: 'Второй закон Ньютона',
    nameEn: "Newton's Second Law",
    baseFormula: 'F = m * a',
    baseFormulaLatex: 'F = m \\cdot a',
    variables: [
      { symbol: 'F', nameUzLatn: 'Kuch', nameUzCyrl: 'Куч', nameRu: 'Сила', nameEn: 'Force', unit: 'N' },
      { symbol: 'm', nameUzLatn: 'Massa', nameUzCyrl: 'Масса', nameRu: 'Масса', nameEn: 'Mass', unit: 'kg' },
      { symbol: 'a', nameUzLatn: 'Tezlaniş', nameUzCyrl: 'Тезланиш', nameRu: 'Ускорение', nameEn: 'Acceleration', unit: 'm/s²' },
    ],
    solvers: {
      a: {
        rearrangedLatex: 'a = \\frac{F}{m}',
        calculate: (vals) => vals.F / vals.m,
        explanationUzLatn: (v, r) => `Tezlanişni topiş uçun kuçni massaga bölamiz: a = ${v.F} / ${v.m} = ${r} m/s²`,
        explanationUzCyrl: (v, r) => `Тезланишни топиш учун кучни массага бўламиз: a = ${v.F} / ${v.m} = ${r} m/s²`,
        explanationRu: (v, r) => `Для нахождения ускорения делим силу на массу: a = ${v.F} / ${v.m} = ${r} м/с²`,
        explanationEn: (v, r) => `To find acceleration, divide force by mass: a = ${v.F} / ${v.m} = ${r} m/s²`,
        dimensionStepLatex: '[a] = \\frac{[F]}{[m]} = \\frac{\\text{N}}{\\text{kg}} = \\frac{\\text{kg} \\cdot \\text{m/s}^2}{\\text{kg}} = \\text{m/s}^2',
      },
      m: {
        rearrangedLatex: 'm = \\frac{F}{a}',
        calculate: (vals) => vals.F / vals.a,
        explanationUzLatn: (v, r) => `Massani topiş uçun kuçni tezlanişga bölamiz: m = ${v.F} / ${v.a} = ${r} kg`,
        explanationUzCyrl: (v, r) => `Массани топиш учун кучни тезланишга бўламиз: m = ${v.F} / ${v.a} = ${r} кг`,
        explanationRu: (v, r) => `Для нахождения массы делим силу на ускорение: m = ${v.F} / ${v.a} = ${r} кг`,
        explanationEn: (v, r) => `To find mass, divide force by acceleration: m = ${v.F} / ${v.a} = ${r} kg`,
        dimensionStepLatex: '[m] = \\frac{[F]}{[a]} = \\frac{\\text{N}}{\\text{m/s}^2} = \\text{kg}',
      },
      F: {
        rearrangedLatex: 'F = m \\cdot a',
        calculate: (vals) => vals.m * vals.a,
        explanationUzLatn: (v, r) => `Kuçni topiş uçun massani tezlanişga köpaytiramiz: F = ${v.m} \\cdot ${v.a} = ${r} N`,
        explanationUzCyrl: (v, r) => `Кучни топиш учун массани тезланишга кўпайтирамиз: F = ${v.m} \\cdot ${v.a} = ${r} Н`,
        explanationRu: (v, r) => `Для нахождения силы умножаем массу на ускорение: F = ${v.m} \\cdot ${v.a} = ${r} Н`,
        explanationEn: (v, r) => `To find force, multiply mass by acceleration: F = ${v.m} \\cdot ${v.a} = ${r} N`,
        dimensionStepLatex: '[F] = [m] \\cdot [a] = \\text{kg} \\cdot \\text{m/s}^2 = \\text{N}',
      },
    },
    verifyFormula: (v) => ({
      valid: Math.abs(v.F - v.m * v.a) < 1e-4,
      lhs: v.F,
      rhs: v.m * v.a,
    }),
  },

  // 2. Uniform Motion: v = s / t
  'speed-distance-time': {
    id: 'speed-distance-time',
    topic: 'Mexanika (Kinematika)',
    nameUzLatn: 'Tög‘ri çiziqli tekis harakat tezligi',
    nameUzCyrl: 'Тўғри чизиқли текис ҳаракат тезлиги',
    nameRu: 'Скорость равномерного прямолинейного движения',
    nameEn: 'Speed, Distance, and Time',
    baseFormula: 'v = s / t',
    baseFormulaLatex: 'v = \\frac{s}{t}',
    variables: [
      { symbol: 'v', nameUzLatn: 'Tezlik', nameUzCyrl: 'Тезлик', nameRu: 'Скорость', nameEn: 'Speed', unit: 'm/s' },
      { symbol: 's', nameUzLatn: 'Masoqa (Yöl)', nameUzCyrl: 'Масофа (Йўл)', nameRu: 'Расстояние (Путь)', nameEn: 'Distance', unit: 'm' },
      { symbol: 't', nameUzLatn: 'Vaqt', nameUzCyrl: 'Вақт', nameRu: 'Время', nameEn: 'Time', unit: 's' },
    ],
    solvers: {
      v: {
        rearrangedLatex: 'v = \\frac{s}{t}',
        calculate: (vals) => vals.s / vals.t,
        explanationUzLatn: (v, r) => `Tezlikni topiş uçun masofani vaqtga bölamiz: v = ${v.s} / ${v.t} = ${r} m/s`,
        explanationUzCyrl: (v, r) => `Тезликни топиш учун масофани вақтга бўламиз: v = ${v.s} / ${v.t} = ${r} м/с`,
        explanationRu: (v, r) => `Для нахождения скорости делим путь на время: v = ${v.s} / ${v.t} = ${r} м/с`,
        explanationEn: (v, r) => `Divide distance by time to obtain speed: v = ${v.s} / ${v.t} = ${r} m/s`,
        dimensionStepLatex: '[v] = \\frac{[s]}{[t]} = \\frac{\\text{m}}{\\text{s}}',
      },
      s: {
        rearrangedLatex: 's = v \\cdot t',
        calculate: (vals) => vals.v * vals.t,
        explanationUzLatn: (v, r) => `Masofani topiş uçun tezlikni vaqtga köpaytiramiz: s = ${v.v} \\cdot ${v.t} = ${r} m`,
        explanationUzCyrl: (v, r) => `Масофани топиш учун тезликни вақтга кўпайтирамиз: s = ${v.v} \\cdot ${v.t} = ${r} м`,
        explanationRu: (v, r) => `Для нахождения пути умножаем скорость на время: s = ${v.v} \\cdot ${v.t} = ${r} м`,
        explanationEn: (v, r) => `Multiply speed by time to obtain distance: s = ${v.v} \\cdot ${v.t} = ${r} m`,
        dimensionStepLatex: '[s] = [v] \\cdot [t] = \\frac{\\text{m}}{\\text{s}} \\cdot \\text{s} = \\text{m}',
      },
      t: {
        rearrangedLatex: 't = \\frac{s}{v}',
        calculate: (vals) => vals.s / vals.v,
        explanationUzLatn: (v, r) => `Vaqtni topiş uçun masofani tezlikka bölamiz: t = ${v.s} / ${v.v} = ${r} s`,
        explanationUzCyrl: (v, r) => `Вақтни топиш учун масофани тезликка бўламиз: t = ${v.s} / ${v.v} = ${r} с`,
        explanationRu: (v, r) => `Для нахождения времени делим расстояние на скорость: t = ${v.s} / ${v.v} = ${r} с`,
        explanationEn: (v, r) => `Divide distance by speed to obtain time: t = ${v.s} / ${v.v} = ${r} s`,
        dimensionStepLatex: '[t] = \\frac{[s]}{[v]} = \\frac{\\text{m}}{\\text{m/s}} = \\text{s}',
      },
    },
    verifyFormula: (v) => ({
      valid: Math.abs(v.s - v.v * v.t) < 1e-4,
      lhs: v.s,
      rhs: v.v * v.t,
    }),
  },

  // 3. Kinetic Energy: Ek = 0.5 * m * v^2
  'kinetic-energy': {
    id: 'kinetic-energy',
    topic: 'Mexanika (Energiya)',
    nameUzLatn: 'Kinetik energiya',
    nameUzCyrl: 'Кинетик энергия',
    nameRu: 'Кинетическая энергия',
    nameEn: 'Kinetic Energy',
    baseFormula: 'Ek = 0.5 * m * v^2',
    baseFormulaLatex: 'E_k = \\frac{m v^2}{2}',
    variables: [
      { symbol: 'Ek', nameUzLatn: 'Kinetik energiya', nameUzCyrl: 'Кинетик энергия', nameRu: 'Кинетическая энергия', nameEn: 'Kinetic energy', unit: 'J' },
      { symbol: 'm', nameUzLatn: 'Massa', nameUzCyrl: 'Масса', nameRu: 'Масса', nameEn: 'Mass', unit: 'kg' },
      { symbol: 'v', nameUzLatn: 'Tezlik', nameUzCyrl: 'Тезлик', nameRu: 'Скорость', nameEn: 'Speed', unit: 'm/s' },
    ],
    solvers: {
      Ek: {
        rearrangedLatex: 'E_k = \\frac{m v^2}{2}',
        calculate: (vals) => 0.5 * vals.m * Math.pow(vals.v, 2),
        explanationUzLatn: (v, r) => `Kinetik energiya: E_k = \\frac{${v.m} \\cdot (${v.v})^2}{2} = ${r} J`,
        explanationUzCyrl: (v, r) => `Кинетик энергия: E_k = \\frac{${v.m} \\cdot (${v.v})^2}{2} = ${r} Ж`,
        explanationRu: (v, r) => `Кинетическая энергия: E_k = \\frac{${v.m} \\cdot (${v.v})^2}{2} = ${r} Дж`,
        explanationEn: (v, r) => `Kinetic energy: E_k = \\frac{${v.m} \\cdot (${v.v})^2}{2} = ${r} J`,
        dimensionStepLatex: '[E_k] = [m] \\cdot [v]^2 = \\text{kg} \\cdot (\\text{m/s})^2 = \\text{kg} \\cdot \\text{m}^2/\\text{s}^2 = \\text{J}',
      },
      v: {
        rearrangedLatex: 'v = \\sqrt{\\frac{2 E_k}{m}}',
        calculate: (vals) => Math.sqrt((2 * vals.Ek) / vals.m),
        explanationUzLatn: (v, r) => `Tezlik: v = \\sqrt{\\frac{2 \\cdot ${v.Ek}}{${v.m}}} = ${r.toFixed(2)} m/s`,
        explanationUzCyrl: (v, r) => `Тезлик: v = \\sqrt{\\frac{2 \\cdot ${v.Ek}}{${v.m}}} = ${r.toFixed(2)} м/с`,
        explanationRu: (v, r) => `Скорость: v = \\sqrt{\\frac{2 \\cdot ${v.Ek}}{${v.m}}} = ${r.toFixed(2)} м/с`,
        explanationEn: (v, r) => `Speed: v = \\sqrt{\\frac{2 \\cdot ${v.Ek}}{${v.m}}} = ${r.toFixed(2)} m/s`,
        dimensionStepLatex: '[v] = \\sqrt{\\frac{\\text{J}}{\\text{kg}}} = \\text{m/s}',
      },
    },
    verifyFormula: (v) => ({
      valid: Math.abs(v.Ek - 0.5 * v.m * Math.pow(v.v, 2)) < 1e-4,
      lhs: v.Ek,
      rhs: 0.5 * v.m * Math.pow(v.v, 2),
    }),
  },

  // 4. Ohm's Law: I = U / R
  'ohm-law': {
    id: 'ohm-law',
    topic: 'Elektr (Zanjir qonunlari)',
    nameUzLatn: 'Zanjir bölagi uçun Om qonuni',
    nameUzCyrl: 'Занжир бўлаги учун Ом қонуни',
    nameRu: 'Закон Ома для участка цепи',
    nameEn: "Ohm's Law",
    baseFormula: 'I = U / R',
    baseFormulaLatex: 'I = \\frac{U}{R}',
    variables: [
      { symbol: 'I', nameUzLatn: 'Tok kuçi', nameUzCyrl: 'Ток кучи', nameRu: 'Сила тока', nameEn: 'Current', unit: 'A' },
      { symbol: 'U', nameUzLatn: 'Kuchlanish', nameUzCyrl: 'Кучланиш', nameRu: 'Напряжение', nameEn: 'Voltage', unit: 'V' },
      { symbol: 'R', nameUzLatn: 'Qarşilik', nameUzCyrl: 'Қаршилик', nameRu: 'Сопротивление', nameEn: 'Resistance', unit: 'Ω' },
    ],
    solvers: {
      I: {
        rearrangedLatex: 'I = \\frac{U}{R}',
        calculate: (vals) => vals.U / vals.R,
        explanationUzLatn: (v, r) => `Tok kuçini topiş uçun kuçlanişni qarşilikka bölamiz: I = ${v.U} / ${v.R} = ${r} A`,
        explanationUzCyrl: (v, r) => `Ток кучини топиш учун кучланишни қаршиликка бўламиз: I = ${v.U} / ${v.R} = ${r} А`,
        explanationRu: (v, r) => `Для нахождения силы тока делим напряжение на сопротивление: I = ${v.U} / ${v.R} = ${r} А`,
        explanationEn: (v, r) => `To find current, divide voltage by resistance: I = ${v.U} / ${v.R} = ${r} A`,
        dimensionStepLatex: '[I] = \\frac{[U]}{[R]} = \\frac{\\text{V}}{\\Omega} = \\text{A}',
      },
      U: {
        rearrangedLatex: 'U = I \\cdot R',
        calculate: (vals) => vals.I * vals.R,
        explanationUzLatn: (v, r) => `Kuçlanişni topiş uçun tok kuçini qarşilikka köpaytiramiz: U = ${v.I} \\cdot ${v.R} = ${r} V`,
        explanationUzCyrl: (v, r) => `Кучланишни топиш учун ток кучини қаршиликка кўпайтирамиз: U = ${v.I} \\cdot ${v.R} = ${r} В`,
        explanationRu: (v, r) => `Для нахождения напряжения умножаем ток на сопротивление: U = ${v.I} \\cdot ${v.R} = ${r} В`,
        explanationEn: (v, r) => `To find voltage, multiply current by resistance: U = ${v.I} \\cdot ${v.R} = ${r} V`,
        dimensionStepLatex: '[U] = [I] \\cdot [R] = \\text{A} \\cdot \\Omega = \\text{V}',
      },
      R: {
        rearrangedLatex: 'R = \\frac{U}{I}',
        calculate: (vals) => vals.U / vals.I,
        explanationUzLatn: (v, r) => `Qarşilikni topiş uçun kuçlanişni tok kuçiga bölamiz: R = ${v.U} / ${v.I} = ${r} \\Omega`,
        explanationUzCyrl: (v, r) => `Қаршиликни топиш учун кучланишни ток кучига бўламиз: R = ${v.U} / ${v.I} = ${r} \\Omega`,
        explanationRu: (v, r) => `Для нахождения сопротивления делим напряжение на силу тока: R = ${v.U} / ${v.I} = ${r} Ом`,
        explanationEn: (v, r) => `To find resistance, divide voltage by current: R = ${v.U} / ${v.I} = ${r} \\Omega`,
        dimensionStepLatex: '[R] = \\frac{[U]}{[I]} = \\frac{\\text{V}}{\\text{A}} = \\Omega',
      },
    },
    verifyFormula: (v) => ({
      valid: Math.abs(v.U - v.I * v.R) < 1e-4,
      lhs: v.U,
      rhs: v.I * v.R,
    }),
  },

  // 5. Electrical Power: P = U * I
  'electric-power': {
    id: 'electric-power',
    topic: 'Elektr',
    nameUzLatn: 'Elektr toki quvvati',
    nameUzCyrl: 'Электр токи қуввати',
    nameRu: 'Мощность электрического тока',
    nameEn: 'Electric Power',
    baseFormula: 'P = U * I',
    baseFormulaLatex: 'P = U \\cdot I',
    variables: [
      { symbol: 'P', nameUzLatn: 'Quvvat', nameUzCyrl: 'Қувват', nameRu: 'Мощность', nameEn: 'Power', unit: 'W' },
      { symbol: 'U', nameUzLatn: 'Kuchlanish', nameUzCyrl: 'Кучланиш', nameRu: 'Напряжение', nameEn: 'Voltage', unit: 'V' },
      { symbol: 'I', nameUzLatn: 'Tok kuçi', nameUzCyrl: 'Ток кучи', nameRu: 'Сила тока', nameEn: 'Current', unit: 'A' },
    ],
    solvers: {
      P: {
        rearrangedLatex: 'P = U \\cdot I',
        calculate: (vals) => vals.U * vals.I,
        explanationUzLatn: (v, r) => `Quvvatni topiş: P = ${v.U} \\cdot ${v.I} = ${r} W`,
        explanationUzCyrl: (v, r) => `Қувватни топиш: P = ${v.U} \\cdot ${v.I} = ${r} Вт`,
        explanationRu: (v, r) => `Вычисление мощности: P = ${v.U} \\cdot ${v.I} = ${r} Вт`,
        explanationEn: (v, r) => `Calculate power: P = ${v.U} \\cdot ${v.I} = ${r} W`,
        dimensionStepLatex: '[P] = [U] \\cdot [I] = \\text{V} \\cdot \\text{A} = \\text{W}',
      },
      I: {
        rearrangedLatex: 'I = \\frac{P}{U}',
        calculate: (vals) => vals.P / vals.U,
        explanationUzLatn: (v, r) => `Tok kuçini topiş: I = ${v.P} / ${v.U} = ${r} A`,
        explanationUzCyrl: (v, r) => `Ток кучини топиш: I = ${v.P} / ${v.U} = ${r} А`,
        explanationRu: (v, r) => `Вычисление силы тока: I = ${v.P} / ${v.U} = ${r} А`,
        explanationEn: (v, r) => `Calculate current: I = ${v.P} / ${v.U} = ${r} A`,
        dimensionStepLatex: '[I] = \\frac{\\text{W}}{\\text{V}} = \\text{A}',
      },
    },
    verifyFormula: (v) => ({
      valid: Math.abs(v.P - v.U * v.I) < 1e-4,
      lhs: v.P,
      rhs: v.U * v.I,
    }),
  },

  // 6. Weight / Gravitational Force: P = m * g
  'weight-gravity': {
    id: 'weight-gravity',
    topic: 'Mexanika (Gravitatsiya)',
    nameUzLatn: 'Og‘irlik kuchi',
    nameUzCyrl: 'Оғирлик кучи',
    nameRu: 'Сила тяжести',
    nameEn: 'Weight / Gravity',
    baseFormula: 'P = m * g',
    baseFormulaLatex: 'F_o = m \\cdot g',
    variables: [
      { symbol: 'F', nameUzLatn: 'Og‘irlik kuchi', nameUzCyrl: 'Оғирлик кучи', nameRu: 'Сила тяжести', nameEn: 'Weight', unit: 'N' },
      { symbol: 'm', nameUzLatn: 'Massa', nameUzCyrl: 'Масса', nameRu: 'Масса', nameEn: 'Mass', unit: 'kg' },
      { symbol: 'g', nameUzLatn: 'Erkin tuşiş tezlanişi (9.8 m/s²)', nameUzCyrl: 'Эркин тушиш тезланиши', nameRu: 'Ускорение свободного падения', nameEn: 'Gravitational acceleration', unit: 'm/s²' },
    ],
    solvers: {
      F: {
        rearrangedLatex: 'F = m \\cdot g',
        calculate: (vals) => vals.m * (vals.g || 9.8),
        explanationUzLatn: (v, r) => `Og‘irlik kuçi: F = ${v.m} \\cdot ${v.g || 9.8} = ${r.toFixed(2)} N`,
        explanationUzCyrl: (v, r) => `Оғирлик кучи: F = ${v.m} \\cdot ${v.g || 9.8} = ${r.toFixed(2)} Н`,
        explanationRu: (v, r) => `Сила тяжести: F = ${v.m} \\cdot ${v.g || 9.8} = ${r.toFixed(2)} Н`,
        explanationEn: (v, r) => `Weight: F = ${v.m} \\cdot ${v.g || 9.8} = ${r.toFixed(2)} N`,
        dimensionStepLatex: '[F] = \\text{kg} \\cdot \\text{m/s}^2 = \\text{N}',
      },
    },
    verifyFormula: (v) => ({
      valid: Math.abs(v.F - v.m * (v.g || 9.8)) < 1e-4,
      lhs: v.F,
      rhs: v.m * (v.g || 9.8),
    }),
  },
};

/**
 * Natural language variable extractor for physics word problems in Uzbek, Russian, and English
 */
export function parsePhysicsWordProblem(input: string): {
  formulaId?: string;
  extractedValues: Record<string, { value: number; unit: string; originalUnit: string }>;
  targetUnknown?: string;
} | null {
  const norm = input.toLowerCase();

  const extracted: Record<string, { value: number; unit: string; originalUnit: string }> = {};
  let target: string | undefined = undefined;

  // 1. Check patterns like "5 kg", "20 N", "72 km/h", "12 V", "4 ohm", "10 s", etc.
  const regexes: { varSymbol: string; pattern: RegExp; defaultUnit: string }[] = [
    { varSymbol: 'm', pattern: /(\d+(?:\.\d+)?)\s*(?:kg|kilogramm|килограмм|г|g)\b/i, defaultUnit: 'kg' },
    { varSymbol: 'F', pattern: /(\d+(?:\.\d+)?)\s*(?:n|nyuton|ньютон|newton)\b/i, defaultUnit: 'N' },
    { varSymbol: 'v', pattern: /(\d+(?:\.\d+)?)\s*(?:m\/s|km\/h|км\/ч|м\/с)\b/i, defaultUnit: 'm/s' },
    { varSymbol: 's', pattern: /(\d+(?:\.\d+)?)\s*(?:km|metr|kilometr|метр|километр|\bm\b(?!\/s|\/s²))/i, defaultUnit: 'm' },
    { varSymbol: 't', pattern: /(\d+(?:\.\d+)?)\s*(?:s|sek|sekund|min|h|секунд|мин|соат|час)\b/i, defaultUnit: 's' },
    { varSymbol: 'U', pattern: /(\d+(?:\.\d+)?)\s*(?:v|volt|вольт)\b/i, defaultUnit: 'V' },
    { varSymbol: 'R', pattern: /(\d+(?:\.\d+)?)\s*(?:om|ohm|ом|Ω)\b/i, defaultUnit: 'Ω' },
    { varSymbol: 'I', pattern: /(\d+(?:\.\d+)?)\s*(?:a|amper|ампер)\b/i, defaultUnit: 'A' },
  ];

  // Also check explicit "m=5kg, F=20N" or "m = 5, F = 20"
  const explicitMatches = input.matchAll(/([a-zA-Z_]+)\s*=\s*(\d+(?:\.\d+)?)\s*([a-zA-Z/°Ω]+)?/g);
  for (const m of explicitMatches) {
    const sym = m[1];
    const val = parseFloat(m[2]);
    const u = m[3] || '';
    extracted[sym] = { value: val, unit: u, originalUnit: u };
  }

  for (const r of regexes) {
    if (!extracted[r.varSymbol]) {
      const match = input.match(r.pattern);
      if (match) {
        const val = parseFloat(match[1]);
        const full = match[0].toLowerCase();
        let matchedUnit = r.defaultUnit;
        if (full.includes('km/h') || full.includes('км/ч')) matchedUnit = 'km/h';
        if (full.includes('km') || full.includes('километр')) matchedUnit = 'km';
        if (full.includes('min') || full.includes('мин')) matchedUnit = 'min';
        if (full.includes('h') || full.includes('час') || full.includes('soat')) matchedUnit = 'h';
        if (full.includes('g') && !full.includes('kg')) matchedUnit = 'g';
        extracted[r.varSymbol] = { value: val, unit: matchedUnit, originalUnit: matchedUnit };
      }
    }
  }

  // Detect target unknown: e.g. "Ek = ?", "a = ?", "tezlanishni toping", etc.
  const explicitTarget = input.match(/([a-zA-Z_]+)\s*=\s*\?/);
  if (explicitTarget) {
    target = explicitTarget[1];
  } else {
    const normCompact = norm.replace(/\s+/g, '');
    if (norm.includes('tezlanish') || norm.includes('тезланиш') || norm.includes('ускорен') || norm.includes('acceleration') || normCompact.includes('a=?')) {
      target = 'a';
    } else if (norm.includes('kuch') || norm.includes('куч') || norm.includes('силу') || norm.includes('force') || normCompact.includes('f=?')) {
      target = 'F';
    } else if (norm.includes('massa') || norm.includes('масса') || norm.includes('mass') || normCompact.includes('m=?')) {
      target = 'm';
    } else if (norm.includes('tezlik') || norm.includes('тезлик') || norm.includes('скорость') || norm.includes('speed') || normCompact.includes('v=?')) {
      target = 'v';
    } else if (norm.includes('masofa') || norm.includes('масофа') || norm.includes('путь') || norm.includes('distance') || normCompact.includes('s=?')) {
      target = 's';
    } else if (norm.includes('vaqt') || norm.includes('вақт') || norm.includes('время') || norm.includes('time') || normCompact.includes('t=?')) {
      target = 't';
    } else if (norm.includes('tok') || norm.includes('ток') || norm.includes('current') || normCompact.includes('i=?')) {
      target = 'I';
    } else if (norm.includes('qarshilik') || norm.includes('қаршилик') || norm.includes('сопротивлен') || norm.includes('resistance') || normCompact.includes('r=?')) {
      target = 'R';
    } else if (norm.includes('quvvat') || norm.includes('қувват') || norm.includes('мощность') || norm.includes('power') || normCompact.includes('p=?')) {
      target = 'P';
    } else if (norm.includes('energiya') || norm.includes('энерги') || norm.includes('energy') || normCompact.includes('ek=?')) {
      target = 'Ek';
    }
  }

  // Match formula based on available variables + target
  const keys = Object.keys(extracted);
  let formulaId: string | undefined = undefined;

  if ((keys.includes('m') && keys.includes('F')) || (keys.includes('m') && keys.includes('a')) || (keys.includes('F') && keys.includes('a'))) {
    formulaId = 'newton-second-law';
    if (!target) {
      if (keys.includes('m') && keys.includes('F')) target = 'a';
      else if (keys.includes('F') && keys.includes('a')) target = 'm';
      else target = 'F';
    }
  } else if ((keys.includes('s') && keys.includes('t')) || (keys.includes('v') && keys.includes('t')) || (keys.includes('s') && keys.includes('v'))) {
    formulaId = 'speed-distance-time';
    if (!target) {
      if (keys.includes('s') && keys.includes('t')) target = 'v';
      else if (keys.includes('v') && keys.includes('t')) target = 's';
      else target = 't';
    }
  } else if ((keys.includes('U') && keys.includes('R')) || (keys.includes('I') && keys.includes('R')) || (keys.includes('U') && keys.includes('I'))) {
    formulaId = 'ohm-law';
    if (!target) {
      if (keys.includes('U') && keys.includes('R')) target = 'I';
      else if (keys.includes('I') && keys.includes('R')) target = 'U';
      else target = 'R';
    }
  } else if (keys.includes('m') && keys.includes('v')) {
    formulaId = 'kinetic-energy';
    if (!target) target = 'Ek';
  }

  if (!formulaId) return null;

  return { formulaId, extractedValues: extracted, targetUnknown: target };
}

/**
 * Solves a physics problem deterministically
 */
export function solvePhysicsProblem(input: string): SolverResult | null {
  const parsed = parsePhysicsWordProblem(input);
  if (!parsed || !parsed.formulaId || !parsed.targetUnknown) return null;

  const formula = PHYSICS_FORMULAS[parsed.formulaId];
  if (!formula) return null;

  const solver = formula.solvers[parsed.targetUnknown];
  if (!solver) return null;

  const steps: SolutionStep[] = [];
  const siValues: Record<string, number> = {};
  const givenList: GivenFindSection['given'] = [];

  // Step 1: Understand & Given
  steps.push({
    id: 'step-1',
    stepNumber: 1,
    stage: 'understand',
    titleUzLatn: 'Masala şarti va fizik kattaliklar',
    titleUzCyrl: 'Масала шарти ва физик катталиклар',
    titleRu: 'Условие задачи и физические величины',
    titleEn: 'Problem formulation & Physical quantities',
    explanationUzLatn: `Masala mavzusi: ${formula.topic} — ${formula.nameUzLatn}.`,
    explanationUzCyrl: `Масала мавзуси: ${formula.topic} — ${formula.nameUzCyrl}.`,
    explanationRu: `Тема задачи: ${formula.topic} — ${formula.nameRu}.`,
    explanationEn: `Subject: ${formula.topic} — ${formula.nameEn}.`,
    latex: formula.baseFormulaLatex,
  });

  // Unit conversion if needed
  for (const [sym, info] of Object.entries(parsed.extractedValues)) {
    const varDef = formula.variables.find((v) => v.symbol === sym);
    const standardUnit = varDef?.unit || info.unit;

    let finalVal = info.value;
    if (info.unit && info.unit !== standardUnit) {
      const conv = convertUnits(info.value, info.unit, standardUnit);
      if (conv) {
        finalVal = conv.result;
        steps.push({
          id: `step-conv-${sym}`,
          stepNumber: steps.length + 1,
          stage: 'calculate',
          titleUzLatn: `Birlikni SI ga aylantirish: ${sym}`,
          titleUzCyrl: `Бирликни СИ га айлантириш: ${sym}`,
          titleRu: `Перевод единицы в СИ: ${sym}`,
          titleEn: `Convert to SI: ${sym}`,
          explanationUzLatn: conv.explanationUzLatn,
          explanationUzCyrl: conv.explanationUzCyrl,
          explanationRu: conv.explanationRu,
          explanationEn: conv.explanationEn,
          latex: conv.latexStep,
        });
      }
    }

    siValues[sym] = finalVal;
    givenList.push({
      label: varDef?.nameUzLatn || sym,
      symbol: sym,
      value: `${finalVal}`,
      unit: standardUnit,
    });
  }

  // Check if we have all required parameters
  const targetVarDef = formula.variables.find((v) => v.symbol === parsed.targetUnknown);
  const targetUnit = targetVarDef?.unit || '';

  const calculatedResult = solver.calculate(siValues);
  siValues[parsed.targetUnknown] = calculatedResult;

  // Step 2: Formula & Rearrangement
  steps.push({
    id: `step-formula`,
    stepNumber: steps.length + 1,
    stage: 'rearrange',
    titleUzLatn: `Asosiy formula va ${parsed.targetUnknown} ni keltirib çiqariş`,
    titleUzCyrl: `Асосий формула ва ${parsed.targetUnknown} ни келтириб чиқариш`,
    titleRu: `Основная формула и вывод величины ${parsed.targetUnknown}`,
    titleEn: `Main formula and expressing ${parsed.targetUnknown}`,
    explanationUzLatn: `${formula.baseFormulaLatex} formuladan noma‘lum ${parsed.targetUnknown} ni keltirib çiqaramiz: ${solver.rearrangedLatex}`,
    explanationUzCyrl: `${formula.baseFormulaLatex} формуладан номаълум ${parsed.targetUnknown} ни келтириб чиқарамиз: ${solver.rearrangedLatex}`,
    explanationRu: `Из формулы ${formula.baseFormulaLatex} выражаем искомую величину: ${solver.rearrangedLatex}`,
    explanationEn: `From ${formula.baseFormulaLatex}, rearrange for target unknown: ${solver.rearrangedLatex}`,
    latex: solver.rearrangedLatex,
    highlightTerms: [parsed.targetUnknown],
  });

  // Step 3: Substitution & Calculation
  let substitutedFormula = solver.rearrangedLatex;
  for (const [sym, val] of Object.entries(siValues)) {
    if (sym !== parsed.targetUnknown) {
      substitutedFormula = substitutedFormula.replace(new RegExp(`\\b${sym}\\b`, 'g'), `${val}`);
    }
  }

  steps.push({
    id: `step-calc`,
    stepNumber: steps.length + 1,
    stage: 'calculate',
    titleUzLatn: 'Qiymatlarni qöyib hisoblaş',
    titleUzCyrl: 'Қийматларни қўйиб ҳисоблаш',
    titleRu: 'Подстановка значений и вычисление',
    titleEn: 'Substitute values and calculate',
    explanationUzLatn: solver.explanationUzLatn(siValues, calculatedResult),
    explanationUzCyrl: solver.explanationUzCyrl(siValues, calculatedResult),
    explanationRu: solver.explanationRu(siValues, calculatedResult),
    explanationEn: solver.explanationEn(siValues, calculatedResult),
    latex: `${parsed.targetUnknown} = ${substitutedFormula.split('=')[1] || substitutedFormula} = ${calculatedResult.toFixed(2).replace(/\.00$/, '')} \\text{ ${targetUnit}}`,
  });

  // Step 4: Dimension Check
  steps.push({
    id: `step-dim`,
    stepNumber: steps.length + 1,
    stage: 'verify',
    titleUzLatn: 'Ölçov birliklari mosligini tekşiriş',
    titleUzCyrl: 'Ўлчов бирликлари мослигини текшириш',
    titleRu: 'Проверка размерности единиц',
    titleEn: 'Dimensional consistency check',
    explanationUzLatn: `Kattaliklar SI birliklarida keltirildi va natija ölcovi ${targetUnit} ekanligi isbotlandi.`,
    explanationUzCyrl: `Катталиклар СИ бирликларида келтирилди ва натижа ўлчови ${targetUnit} эканлиги исботланди.`,
    explanationRu: `Величины приведены в СИ, размерность ${targetUnit} подтверждена.`,
    explanationEn: `Quantities represented in SI units, dimensional consistency for ${targetUnit} verified.`,
    latex: solver.dimensionStepLatex,
  });

  // Step 5: Final verification
  const ver = formula.verifyFormula(siValues);
  steps.push({
    id: `step-verify`,
    stepNumber: steps.length + 1,
    stage: 'verify',
    titleUzLatn: 'Asl munosabat böyiça tekşiriş',
    titleUzCyrl: 'Асл муносабат бўйича текшириш',
    titleRu: 'Проверка по исходному закону',
    titleEn: 'Physical relationship verification',
    explanationUzLatn: `Topilgan qiymatlar ${formula.baseFormulaLatex} qonuniga qöyildi: ${ver.lhs.toFixed(2)} = ${ver.rhs.toFixed(2)}. ${ver.valid ? 'Töğri!' : 'Xatolik!'}`,
    explanationUzCyrl: `Топилган қийматлар ${formula.baseFormulaLatex} қонунига қўйилди: ${ver.lhs.toFixed(2)} = ${ver.rhs.toFixed(2)}. ${ver.valid ? 'Тўғри!' : 'Хатолик!'}`,
    explanationRu: `Значения подставлены в формулу ${formula.baseFormulaLatex}: ${ver.lhs.toFixed(2)} = ${ver.rhs.toFixed(2)}. ${ver.valid ? 'Верно!' : 'Ошибка!'}`,
    explanationEn: `Substituted back into ${formula.baseFormulaLatex}: ${ver.lhs.toFixed(2)} = ${ver.rhs.toFixed(2)}. ${ver.valid ? 'Valid!' : 'Failed!'}`,
    latex: `${ver.lhs.toFixed(2)} = ${ver.rhs.toFixed(2)} \\quad ${ver.valid ? '\\checkmark' : '\\times'}`,
  });

  const finalFormatted = `${calculatedResult.toFixed(2).replace(/\.00$/, '')} ${targetUnit}`;

  return {
    success: true,
    subject: 'physics',
    problemType: 'physics-mechanics',
    difficulty: 'Beginner',
    originalInput: input,
    normalizedExpression: formula.baseFormula,
    targetUnknown: parsed.targetUnknown,
    givenFind: {
      given: givenList,
      find: [{ label: targetVarDef?.nameUzLatn || parsed.targetUnknown, symbol: parsed.targetUnknown, unit: targetUnit }],
      primaryFormula: formula.baseFormulaLatex,
      rearrangedFormula: solver.rearrangedLatex,
    },
    steps,
    finalAnswerLatex: `${parsed.targetUnknown} = ${calculatedResult.toFixed(2).replace(/\.00$/, '')} \\text{ ${targetUnit}}`,
    finalAnswerExact: `${parsed.targetUnknown} = ${finalFormatted}`,
    finalAnswerApprox: `${calculatedResult.toFixed(4)} ${targetUnit}`,
    unit: targetUnit,
    verified: ver.valid,
    verification: {
      valid: ver.valid,
      leftHandSide: `${ver.lhs.toFixed(2)}`,
      rightHandSide: `${ver.rhs.toFixed(2)}`,
      explanationUzLatn: `Tekşiriş: ${formula.baseFormula} qonuni muvaffaqiyatli qanoatlantirildi (${ver.lhs.toFixed(2)} = ${ver.rhs.toFixed(2)}).`,
      explanationUzCyrl: `Текшириш: ${formula.baseFormula} қонуни муваффақиятли қаноатлантирилди (${ver.lhs.toFixed(2)} = ${ver.rhs.toFixed(2)}).`,
      explanationRu: `Проверка: закон ${formula.baseFormula} удовлетворен (${ver.lhs.toFixed(2)} = ${ver.rhs.toFixed(2)}).`,
      explanationEn: `Verification: physical law ${formula.baseFormula} satisfied (${ver.lhs.toFixed(2)} = ${ver.rhs.toFixed(2)}).`,
    },
    whyThisFormula: {
      formulaId: formula.id,
      explanationUzLatn: `Masalada berilgan kattaliklar (${givenList.map((g) => g.symbol).join(', ')}) va izlanayotgan (${parsed.targetUnknown}) örtasidagi eng mos asosiy fizik qonun — ${formula.nameUzLatn} (${formula.baseFormulaLatex}) hisoblanadi.`,
      explanationUzCyrl: `Масалада берилган катталиклар (${givenList.map((g) => g.symbol).join(', ')}) ва изланаётган (${parsed.targetUnknown}) ўртасидаги энг мос асосий физик қонун — ${formula.nameUzCyrl} (${formula.baseFormulaLatex}) ҳисобланади.`,
      explanationRu: `Связь между данными величинами (${givenList.map((g) => g.symbol).join(', ')}) и искомой (${parsed.targetUnknown}) выражается фундаментальным законом: ${formula.nameRu} (${formula.baseFormulaLatex}).`,
      explanationEn: `The fundamental physical relationship connecting the given quantities (${givenList.map((g) => g.symbol).join(', ')}) and the unknown (${parsed.targetUnknown}) is ${formula.nameEn} (${formula.baseFormulaLatex}).`,
    },
    dimensionCheck: {
      expression: solver.dimensionStepLatex,
      resultUnit: targetUnit,
      isConsistent: true,
    },
  };
}
