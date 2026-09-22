export interface UnitCategory {
  id: string;
  nameUzLatn: string;
  nameUzCyrl: string;
  nameRu: string;
  nameEn: string;
  units: { symbol: string; nameUzLatn: string }[];
}

export const UNIT_CATEGORIES: Record<string, UnitCategory> = {
  speed: {
    id: 'speed',
    nameUzLatn: 'Tezlik',
    nameUzCyrl: 'Тезлик',
    nameRu: 'Скорость',
    nameEn: 'Speed',
    units: [
      { symbol: 'm/s', nameUzLatn: 'Metr / sekund' },
      { symbol: 'km/h', nameUzLatn: 'Kilometr / soat' },
    ],
  },
  length: {
    id: 'length',
    nameUzLatn: 'Uzunlik',
    nameUzCyrl: 'Узунлик',
    nameRu: 'Длина',
    nameEn: 'Length',
    units: [
      { symbol: 'm', nameUzLatn: 'Metr' },
      { symbol: 'km', nameUzLatn: 'Kilometr' },
      { symbol: 'cm', nameUzLatn: 'Santimetr' },
      { symbol: 'mm', nameUzLatn: 'Millimetr' },
      { symbol: 'dm', nameUzLatn: 'Detsimetr' },
    ],
  },
  mass: {
    id: 'mass',
    nameUzLatn: 'Massa',
    nameUzCyrl: 'Масса',
    nameRu: 'Масса',
    nameEn: 'Mass',
    units: [
      { symbol: 'kg', nameUzLatn: 'Kilogramm' },
      { symbol: 'g', nameUzLatn: 'Gramm' },
      { symbol: 'mg', nameUzLatn: 'Milligramm' },
      { symbol: 't', nameUzLatn: 'Tonna' },
    ],
  },
  time: {
    id: 'time',
    nameUzLatn: 'Vaqt',
    nameUzCyrl: 'Вақт',
    nameRu: 'Время',
    nameEn: 'Time',
    units: [
      { symbol: 's', nameUzLatn: 'Sekund' },
      { symbol: 'min', nameUzLatn: 'Minut' },
      { symbol: 'h', nameUzLatn: 'Soat' },
      { symbol: 'ms', nameUzLatn: 'Millisekund' },
    ],
  },
  force: {
    id: 'force',
    nameUzLatn: 'Kuch',
    nameUzCyrl: 'Куч',
    nameRu: 'Сила',
    nameEn: 'Force',
    units: [
      { symbol: 'N', nameUzLatn: 'Nyuton' },
      { symbol: 'kN', nameUzLatn: 'Kilonyuton' },
      { symbol: 'MN', nameUzLatn: 'Meganyuton' },
    ],
  },
  energy: {
    id: 'energy',
    nameUzLatn: 'Energiya / Ish',
    nameUzCyrl: 'Энергия / Иш',
    nameRu: 'Энергия',
    nameEn: 'Energy',
    units: [
      { symbol: 'J', nameUzLatn: 'Joul' },
      { symbol: 'kJ', nameUzLatn: 'Kilojoul' },
      { symbol: 'MJ', nameUzLatn: 'Megajoul' },
      { symbol: 'cal', nameUzLatn: 'Kaloriya' },
    ],
  },
  power: {
    id: 'power',
    nameUzLatn: 'Quvvat',
    nameUzCyrl: 'Қувват',
    nameRu: 'Мощность',
    nameEn: 'Power',
    units: [
      { symbol: 'W', nameUzLatn: 'Vatt' },
      { symbol: 'kW', nameUzLatn: 'Kilovatt' },
      { symbol: 'MW', nameUzLatn: 'Megavatt' },
    ],
  },
  pressure: {
    id: 'pressure',
    nameUzLatn: 'Bosim',
    nameUzCyrl: 'Босим',
    nameRu: 'Давление',
    nameEn: 'Pressure',
    units: [
      { symbol: 'Pa', nameUzLatn: 'Paskal' },
      { symbol: 'kPa', nameUzLatn: 'Kilopaskal' },
      { symbol: 'MPa', nameUzLatn: 'Megapaskal' },
      { symbol: 'bar', nameUzLatn: 'Bar' },
    ],
  },
  temperature: {
    id: 'temperature',
    nameUzLatn: 'Harorat',
    nameUzCyrl: 'Ҳарорат',
    nameRu: 'Температура',
    nameEn: 'Temperature',
    units: [
      { symbol: 'K', nameUzLatn: 'Kelvin' },
      { symbol: '°C', nameUzLatn: 'Selsiy' },
    ],
  },
  electricity: {
    id: 'electricity',
    nameUzLatn: 'Elektr kattaliklari',
    nameUzCyrl: 'Электр катталиклари',
    nameRu: 'Электричество',
    nameEn: 'Electricity',
    units: [
      { symbol: 'A', nameUzLatn: 'Amper' },
      { symbol: 'mA', nameUzLatn: 'Milliamper' },
      { symbol: 'V', nameUzLatn: 'Volt' },
      { symbol: 'kV', nameUzLatn: 'Kilovolt' },
      { symbol: 'Ω', nameUzLatn: 'Om' },
      { symbol: 'kΩ', nameUzLatn: 'Kiloom' },
    ],
  },
};

export interface UnitInfo {
  name: string;
  category: 'length' | 'mass' | 'time' | 'speed' | 'force' | 'energy' | 'power' | 'pressure' | 'temperature' | 'electricity';
  baseUnit: string;
  toBaseFactor: number; // multiply by this to get base unit
  offset?: number; // for temperature
}

export const UNIT_REGISTRY: Record<string, UnitInfo> = {
  // Length (base: m)
  'mm': { name: 'millimetr', category: 'length', baseUnit: 'm', toBaseFactor: 0.001 },
  'cm': { name: 'santimetr', category: 'length', baseUnit: 'm', toBaseFactor: 0.01 },
  'dm': { name: 'detsimetr', category: 'length', baseUnit: 'm', toBaseFactor: 0.1 },
  'm': { name: 'metr', category: 'length', baseUnit: 'm', toBaseFactor: 1 },
  'km': { name: 'kilometr', category: 'length', baseUnit: 'm', toBaseFactor: 1000 },

  // Mass (base: kg)
  'mg': { name: 'milligramm', category: 'mass', baseUnit: 'kg', toBaseFactor: 1e-6 },
  'g': { name: 'gramm', category: 'mass', baseUnit: 'kg', toBaseFactor: 0.001 },
  'kg': { name: 'kilogramm', category: 'mass', baseUnit: 'kg', toBaseFactor: 1 },
  't': { name: 'tonna', category: 'mass', baseUnit: 'kg', toBaseFactor: 1000 },

  // Time (base: s)
  'ms': { name: 'millisekund', category: 'time', baseUnit: 's', toBaseFactor: 0.001 },
  's': { name: 'sekund', category: 'time', baseUnit: 's', toBaseFactor: 1 },
  'min': { name: 'minut', category: 'time', baseUnit: 's', toBaseFactor: 60 },
  'h': { name: 'soat', category: 'time', baseUnit: 's', toBaseFactor: 3600 },

  // Speed (base: m/s)
  'm/s': { name: 'metr/sekund', category: 'speed', baseUnit: 'm/s', toBaseFactor: 1 },
  'km/h': { name: 'kilometr/soat', category: 'speed', baseUnit: 'm/s', toBaseFactor: 1000 / 3600 },

  // Force (base: N)
  'N': { name: 'nyuton', category: 'force', baseUnit: 'N', toBaseFactor: 1 },
  'kN': { name: 'kiloniuton', category: 'force', baseUnit: 'N', toBaseFactor: 1000 },
  'MN': { name: 'meganiuton', category: 'force', baseUnit: 'N', toBaseFactor: 1e6 },

  // Energy / Work (base: J)
  'J': { name: 'joul', category: 'energy', baseUnit: 'J', toBaseFactor: 1 },
  'kJ': { name: 'kilojoul', category: 'energy', baseUnit: 'J', toBaseFactor: 1000 },
  'MJ': { name: 'megajoul', category: 'energy', baseUnit: 'J', toBaseFactor: 1e6 },
  'cal': { name: 'kaloriya', category: 'energy', baseUnit: 'J', toBaseFactor: 4.184 },

  // Power (base: W)
  'W': { name: 'vatt', category: 'power', baseUnit: 'W', toBaseFactor: 1 },
  'kW': { name: 'kilovatt', category: 'power', baseUnit: 'W', toBaseFactor: 1000 },
  'MW': { name: 'megavatt', category: 'power', baseUnit: 'W', toBaseFactor: 1e6 },

  // Pressure (base: Pa)
  'Pa': { name: 'paskal', category: 'pressure', baseUnit: 'Pa', toBaseFactor: 1 },
  'kPa': { name: 'kilopaskal', category: 'pressure', baseUnit: 'Pa', toBaseFactor: 1000 },
  'MPa': { name: 'megapaskal', category: 'pressure', baseUnit: 'Pa', toBaseFactor: 1e6 },
  'bar': { name: 'bar', category: 'pressure', baseUnit: 'Pa', toBaseFactor: 100000 },

  // Temperature (base: K)
  'K': { name: 'kelvin', category: 'temperature', baseUnit: 'K', toBaseFactor: 1 },
  '°C': { name: 'selsiy', category: 'temperature', baseUnit: 'K', toBaseFactor: 1, offset: 273.15 },

  // Electricity
  'A': { name: 'amper', category: 'electricity', baseUnit: 'A', toBaseFactor: 1 },
  'mA': { name: 'milliamper', category: 'electricity', baseUnit: 'A', toBaseFactor: 0.001 },
  'V': { name: 'volt', category: 'electricity', baseUnit: 'V', toBaseFactor: 1 },
  'mV': { name: 'millivolt', category: 'electricity', baseUnit: 'V', toBaseFactor: 0.001 },
  'kV': { name: 'kilovolt', category: 'electricity', baseUnit: 'V', toBaseFactor: 1000 },
  'Ω': { name: 'om', category: 'electricity', baseUnit: 'Ω', toBaseFactor: 1 },
  'kΩ': { name: 'kiloom', category: 'electricity', baseUnit: 'Ω', toBaseFactor: 1000 },
  'C': { name: 'kulon', category: 'electricity', baseUnit: 'C', toBaseFactor: 1 },
  'F': { name: 'farad', category: 'electricity', baseUnit: 'F', toBaseFactor: 1 },
  'Hz': { name: 'gers', category: 'electricity', baseUnit: 'Hz', toBaseFactor: 1 },
};

export interface ConversionStep {
  value: number;
  fromUnit: string;
  toUnit: string;
  result: number;
  latexStep: string;
  explanationUzLatn: string;
  explanationUzCyrl: string;
  explanationRu: string;
  explanationEn: string;
}

export function convertUnits(value: number, from: string, to: string): ConversionStep | null {
  const cleanFrom = from.trim();
  const cleanTo = to.trim();

  if (cleanFrom === cleanTo) {
    return {
      value,
      fromUnit: cleanFrom,
      toUnit: cleanTo,
      result: value,
      latexStep: `${value}\\text{ ${cleanFrom}} = ${value}\\text{ ${cleanTo}}`,
      explanationUzLatn: 'Birliklar bir xil, aylantirish talab etilmaydi.',
      explanationUzCyrl: 'Бирликлар бир хил, айлантириш талаб этилмайди.',
      explanationRu: 'Единицы одинаковы, конвертация не требуется.',
      explanationEn: 'Units are identical, no conversion needed.',
    };
  }

  const uFrom = UNIT_REGISTRY[cleanFrom];
  const uTo = UNIT_REGISTRY[cleanTo];

  if (!uFrom || !uTo) return null;
  if (uFrom.category !== uTo.category) return null;

  // Temperature special case
  if (uFrom.category === 'temperature') {
    let kelvin = value;
    if (cleanFrom === '°C') kelvin = value + 273.15;
    let res = kelvin;
    if (cleanTo === '°C') res = kelvin - 273.15;
    return {
      value,
      fromUnit: cleanFrom,
      toUnit: cleanTo,
      result: Number(res.toFixed(4)),
      latexStep: `${value}^\\circ\\text{C} + 273.15 = ${res}\\text{ K}`,
      explanationUzLatn: `${value} ${cleanFrom} ni ${cleanTo} ga aylantirish.`,
      explanationUzCyrl: `${value} ${cleanFrom} ни ${cleanTo} га айлантириш.`,
      explanationRu: `Перевод ${value} ${cleanFrom} в ${cleanTo}.`,
      explanationEn: `Convert ${value} ${cleanFrom} to ${cleanTo}.`,
    };
  }

  // Speed special case: km/h -> m/s
  if (cleanFrom === 'km/h' && cleanTo === 'm/s') {
    const res = Number(((value * 1000) / 3600).toFixed(4));
    return {
      value,
      fromUnit: cleanFrom,
      toUnit: cleanTo,
      result: res,
      latexStep: `${value}\\text{ km/h} = ${value} \\times \\frac{1000\\text{ m}}{3600\\text{ s}} = ${res}\\text{ m/s}`,
      explanationUzLatn: `${value} km/h tezlikni 1000 ga köpaytirib, 3600 ga böliş orqali SI tizimidagi m/s ga aylantiramiz: ${res} m/s.`,
      explanationUzCyrl: `${value} km/h тезликни 1000 га кўпайтириб, 3600 га бўлиш орқали СИ тизимидаги m/s га айлантирамиз: ${res} m/s.`,
      explanationRu: `Переводим скорость ${value} км/ч в м/с умножением на 1000 и делением на 3600: ${res} м/с.`,
      explanationEn: `Convert speed ${value} km/h to m/s by multiplying by 1000 and dividing by 3600: ${res} m/s.`,
    };
  }

  // Base factor conversion
  const valInBase = value * uFrom.toBaseFactor;
  const res = Number((valInBase / uTo.toBaseFactor).toFixed(6));

  const factor = uFrom.toBaseFactor / uTo.toBaseFactor;
  const factorStr = factor >= 1 ? `\\times ${factor}` : `\\div ${Math.round(1 / factor)}`;

  return {
    value,
    fromUnit: cleanFrom,
    toUnit: cleanTo,
    result: res,
    latexStep: `${value}\\text{ ${cleanFrom}} ${factorStr} = ${res}\\text{ ${cleanTo}}`,
    explanationUzLatn: `${value} ${cleanFrom} kattalikni ${cleanTo} ga aylantiriş: ${res} ${cleanTo}.`,
    explanationUzCyrl: `${value} ${cleanFrom} катталикни ${cleanTo} га айлантириш: ${res} ${cleanTo}.`,
    explanationRu: `Перевод ${value} ${cleanFrom} в ${cleanTo}: ${res} ${cleanTo}.`,
    explanationEn: `Converted ${value} ${cleanFrom} to ${cleanTo}: ${res} ${cleanTo}.`,
  };
}
