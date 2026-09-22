import { Language } from '../types';

/**
 * Transliterates text into the custom Uzbek Latin specification:
 * Gʻ, gʻ -> Ğ, ğ
 * Oʻ, oʻ -> Ö, ö
 * Sh, sh -> Ş, ş
 * Ch, ch -> Ç, ç
 */
export function formatUzLatn(text: string): string {
  if (!text) return '';
  return text
    // Ch, ch
    .replace(/CH/g, 'Ç')
    .replace(/Ch/g, 'Ç')
    .replace(/ch/g, 'ç')
    // Sh, sh
    .replace(/SH/g, 'Ş')
    .replace(/Sh/g, 'Ş')
    .replace(/sh/g, 'ş')
    // Gʻ, gʻ with various apostrophe types
    .replace(/G['`ʻʼ]/g, 'Ğ')
    .replace(/g['`ʻʼ]/g, 'ğ')
    // Oʻ, oʻ with various apostrophe types
    .replace(/O['`ʻʼ]/g, 'Ö')
    .replace(/o['`ʻʼ]/g, 'ö');
}

export const translations = {
  // Brand
  brandName: {
    'uz-latn': 'IlmHub Math',
    'uz-cyrl': 'ИлмХаб Матҳ',
    'ru': 'IlmHub Math',
    'en': 'IlmHub Math',
  },
  brandTagline: {
    'uz-latn': 'Matematik va Fizika Masalalarini Bosqiçma-Bosqiç Yeçing',
    'uz-cyrl': 'Математик ва Физика Масалаларини Босқичма-Босқич Ечинг',
    'ru': 'Пошаговое решение задач по математике и физике',
    'en': 'Step-by-step Mathematics and Physics Problem Solver',
  },
  brandDescription: {
    'uz-latn': 'Deterministik hisoblaş, bosqiçma-bosqiç vizual animatsiyalar, formulalar bazasi va tekşiriş tizimi.',
    'uz-cyrl': 'Детерминистик ҳисоблаш, босқичма-босқич визуал анимациялар, формулалар базаси ва текшириш тизими.',
    'ru': 'Детерминированные вычисления, пошаговые визуальные анимации, база формул и система проверки.',
    'en': 'Deterministic calculations, animated step-by-step transformations, formula database, and verification.',
  },

  // Navigation
  navSolve: {
    'uz-latn': 'Yeçiş',
    'uz-cyrl': 'Ечиш',
    'ru': 'Решатель',
    'en': 'Solver',
  },
  navMath: {
    'uz-latn': 'Matematika',
    'uz-cyrl': 'Математика',
    'ru': 'Математика',
    'en': 'Mathematics',
  },
  navPhysics: {
    'uz-latn': 'Fizika',
    'uz-cyrl': 'Физика',
    'ru': 'Физика',
    'en': 'Physics',
  },
  navFormulas: {
    'uz-latn': 'Formulalar',
    'uz-cyrl': 'Формулалар',
    'ru': 'Формулы',
    'en': 'Formulas',
  },
  navExamples: {
    'uz-latn': 'Misollar',
    'uz-cyrl': 'Мисоллар',
    'ru': 'Примеры',
    'en': 'Examples',
  },
  navLearn: {
    'uz-latn': 'Örganiş',
    'uz-cyrl': 'Ўрганиш',
    'ru': 'Обучение',
    'en': 'Learn',
  },
  navHistory: {
    'uz-latn': 'Tarix',
    'uz-cyrl': 'Тарих',
    'ru': 'История',
    'en': 'History',
  },
  navFavorites: {
    'uz-latn': 'Sevimli',
    'uz-cyrl': 'Севимли',
    'ru': 'Избранное',
    'en': 'Favorites',
  },
  navDashboard: {
    'uz-latn': 'Kabineta',
    'uz-cyrl': 'Кабинет',
    'ru': 'Панель',
    'en': 'Dashboard',
  },
  navSettings: {
    'uz-latn': 'Sozlamalar',
    'uz-cyrl': 'Созламалар',
    'ru': 'Настройки',
    'en': 'Settings',
  },

  // Solver UI
  enterProblemPlaceholder: {
    'uz-latn': 'Tenglama, ifoda yoki masalani yozing (masalan: 3x + 7 = 25 yoki F = 20 N, m = 5 kg)...',
    'uz-cyrl': 'Тенглама, ифода ёки масалани ёзинг (масалан: 3x + 7 = 25 ёки F = 20 N, m = 5 kg)...',
    'ru': 'Введите уравнение, выражение или задачу (например: 3x + 7 = 25 или F = 20 Н, m = 5 кг)...',
    'en': 'Enter equation, expression or problem (e.g. 3x + 7 = 25 or F = 20 N, m = 5 kg)...',
  },
  solveButton: {
    'uz-latn': 'Masalani Yeçiş',
    'uz-cyrl': 'Масалани Ечиш',
    'ru': 'Решить задачу',
    'en': 'Solve Problem',
  },
  solvingProgress: {
    'uz-latn': 'Masala tahlil qilinmoqda...',
    'uz-cyrl': 'Масала таҳлил қилинмоқда...',
    'ru': 'Анализируем задачу...',
    'en': 'Analyzing problem...',
  },
  uploadImageBtn: {
    'uz-latn': 'Rasm Yuklaş',
    'uz-cyrl': 'Расм Юклаш',
    'ru': 'Загрузить фото',
    'en': 'Upload Image',
  },
  imageScanTitle: {
    'uz-latn': 'Masala Rasmini Tanib Oliş (OCR)',
    'uz-cyrl': 'Масала Расмини Таниб Олиш (OCR)',
    'ru': 'Распознавание задачи по фото (OCR)',
    'en': 'Extract Problem from Image (OCR)',
  },
  imageScanDescription: {
    'uz-latn': 'Rasmni yuklang, aniqlangan matnni tekşiring va tahrirlab yeçişga yuboring.',
    'uz-cyrl': 'Расмни юкланг, аниқланган матнни текширинг ва таҳрирлаб ечишга юборинг.',
    'ru': 'Загрузите изображение, проверьте распознанный текст, отредактируйте и отправьте на решение.',
    'en': 'Upload an image, verify the detected text, edit if needed, and solve.',
  },
  detectedProblemLabel: {
    'uz-latn': 'Aniqlangan masala:',
    'uz-cyrl': 'Аниқланган масала:',
    'ru': 'Распознанная задача:',
    'en': 'Detected problem:',
  },
  confirmAndSolve: {
    'uz-latn': 'Tasdiqlaş va Yeçiş',
    'uz-cyrl': 'Тасдиқлаш ва Ечиш',
    'ru': 'Подтвердить и решить',
    'en': 'Confirm and Solve',
  },

  // Structured Sections
  sectionGiven: {
    'uz-latn': 'BERILGAN',
    'uz-cyrl': 'БЕРИЛГАН',
    'ru': 'ДАНО',
    'en': 'GIVEN',
  },
  sectionFind: {
    'uz-latn': 'TOPİŞ KERAK',
    'uz-cyrl': 'ТОПИШ КЕРАК',
    'ru': 'НАЙТИ',
    'en': 'FIND',
  },
  sectionFormula: {
    'uz-latn': 'FORMULA',
    'uz-cyrl': 'ФОРМУЛА',
    'ru': 'ФОРМУЛА',
    'en': 'FORMULA',
  },
  sectionSolution: {
    'uz-latn': 'YEÇİŞ',
    'uz-cyrl': 'ЕЧИШ',
    'ru': 'РЕШЕНИЕ',
    'en': 'SOLUTION',
  },
  sectionVerification: {
    'uz-latn': 'TEKŞİRİŞ',
    'uz-cyrl': 'ТЕКШИРИШ',
    'ru': 'ПРОВЕРКА',
    'en': 'VERIFICATION',
  },
  sectionAnswer: {
    'uz-latn': 'JAVOB',
    'uz-cyrl': 'ЖАВОБ',
    'ru': 'ОТВЕТ',
    'en': 'ANSWER',
  },

  // Player controls
  prevStep: {
    'uz-latn': 'Oldingi bosqiç',
    'uz-cyrl': 'Олдинги босқич',
    'ru': 'Предыдущий шаг',
    'en': 'Previous step',
  },
  nextStep: {
    'uz-latn': 'Keyingi bosqiç',
    'uz-cyrl': 'Кейинги босқич',
    'ru': 'Следующий шаг',
    'en': 'Next step',
  },
  playAnimation: {
    'uz-latn': 'Ijro etiş',
    'uz-cyrl': 'Ижро этиш',
    'ru': 'Воспроизвести',
    'en': 'Play',
  },
  pauseAnimation: {
    'uz-latn': 'Töxtatiş',
    'uz-cyrl': 'Тўхтатиш',
    'ru': 'Пауза',
    'en': 'Pause',
  },
  restartAnimation: {
    'uz-latn': 'Qaytadan',
    'uz-cyrl': 'Қайтадан',
    'ru': 'Сначала',
    'en': 'Restart',
  },
  speedLabel: {
    'uz-latn': 'Tezlik',
    'uz-cyrl': 'Тезлик',
    'ru': 'Скорость',
    'en': 'Speed',
  },
  stepIndicator: {
    'uz-latn': 'Bosqiç',
    'uz-cyrl': 'Босқич',
    'ru': 'Шаг',
    'en': 'Step',
  },

  // Why this formula
  whyFormulaTitle: {
    'uz-latn': 'Nima uçun aynan şu formula?',
    'uz-cyrl': 'Нима учун айнан шу формула?',
    'ru': 'Почему именно эта формула?',
    'en': 'Why this formula?',
  },
  verifiedLabel: {
    'uz-latn': 'Muvaffaqiyatli tekşirildi',
    'uz-cyrl': 'Муваффақиятли текширилди',
    'ru': 'Успешно проверено',
    'en': 'Successfully verified',
  },
  verificationFailedLabel: {
    'uz-latn': 'Tekşirişda nomuvofiqlik',
    'uz-cyrl': 'Текширишда номувофиқлик',
    'ru': 'Ошибка проверки',
    'en': 'Verification failed',
  },

  // Exact / Decimal
  exactResult: {
    'uz-latn': 'Aniq qiymat',
    'uz-cyrl': 'Аниқ қиймат',
    'ru': 'Точный вид',
    'en': 'Exact',
  },
  approxResult: {
    'uz-latn': 'Önlik yaqinlaşuv',
    'uz-cyrl': 'Ўнлик яқинлашув',
    'ru': 'Приближенно',
    'en': 'Approximate',
  },
  copySolution: {
    'uz-latn': 'Nusxa oliş',
    'uz-cyrl': 'Нусха олиш',
    'ru': 'Копировать решение',
    'en': 'Copy solution',
  },
  copiedSuccess: {
    'uz-latn': 'Nusxalandi!',
    'uz-cyrl': 'Нусхаланди!',
    'ru': 'Скопировано!',
    'en': 'Copied!',
  },
  printSolution: {
    'uz-latn': 'Çop etiş (PDF)',
    'uz-cyrl': 'Чоп этиш (PDF)',
    'ru': 'Печать / PDF',
    'en': 'Print / PDF',
  },
  shareSolution: {
    'uz-latn': 'Ulaşiş',
    'uz-cyrl': 'Улашиш',
    'ru': 'Поделиться',
    'en': 'Share',
  },

  // Theme & Languages
  themeLight: {
    'uz-latn': 'Yoruğ',
    'uz-cyrl': 'Ёруғ',
    'ru': 'Светлая',
    'en': 'Light',
  },
  themeDark: {
    'uz-latn': 'Qorong‘i',
    'uz-cyrl': 'Қоронғи',
    'ru': 'Темная',
    'en': 'Dark',
  },
  themeSystem: {
    'uz-latn': 'Tizim',
    'uz-cyrl': 'Тизим',
    'ru': 'Системная',
    'en': 'System',
  },

  // Educational modes
  modeEducational: {
    'uz-latn': 'Ta‘limiy rejim (Kengaytirilgan)',
    'uz-cyrl': 'Таълимий режим (Кенгайтирилган)',
    'ru': 'Обучающий режим (Подробно)',
    'en': 'Educational Mode (Thorough)',
  },
  modeQuick: {
    'uz-latn': 'Tezkor rejim (Qisqa)',
    'uz-cyrl': 'Тезкор режим (Қисқа)',
    'ru': 'Быстрый режим (Кратко)',
    'en': 'Quick Mode (Concise)',
  },

  // Empty states
  emptyHistoryTitle: {
    'uz-latn': 'Hozirça yeçilgan masalalar yöq',
    'uz-cyrl': 'Ҳозирча ечилган масалалар йўқ',
    'ru': 'История решений пуста',
    'en': 'No solved problems yet',
  },
  emptyHistoryDesc: {
    'uz-latn': 'Yeçilgan barcha masalalar va ularning tahlillari bu yerda avtomatik saqlanadi.',
    'uz-cyrl': 'Ечилган барча масалалар ва уларнинг таҳлиллари бу ерда автоматик сақланади.',
    'ru': 'Все решенные задачи и их шаги будут автоматически сохраняться здесь.',
    'en': 'All solved problems and step breakdowns will be preserved here.',
  },
  emptyFavoritesTitle: {
    'uz-latn': 'Sevimli formulalar saqlanmagan',
    'uz-cyrl': 'Севимли формулалар сақланмаган',
    'ru': 'Нет избранных формул',
    'en': 'No favorite formulas saved',
  },
  emptyFavoritesDesc: {
    'uz-latn': 'Formulalar kutubxonasidagi yulduzça belgisini bosib, sevimli formulalaringizni qöşing.',
    'uz-cyrl': 'Формулалар кутубхонасидаги юлдузча белгисини босиб, севимли формулаларингизни қўшинг.',
    'ru': 'Нажмите звездочку в библиотеке формул, чтобы добавить нужные формулы в закладки.',
    'en': 'Click the star icon in the formula library to bookmark important formulas.',
  },

  // Formulas UI
  searchFormulasPlaceholder: {
    'uz-latn': 'Formula, kattalik yoki qonunni qidiring (masalan: Nyuton, F=ma, Ohm, tezlaniş)...',
    'uz-cyrl': 'Формула, катталик ёки қонунни қидиринг (масалан: Ньютон, F=ma, Ом, тезланиш)...',
    'ru': 'Поиск формулы, величины или закона (например: Ньютон, F=ma, Ом, ускорение)...',
    'en': 'Search formula, quantity or law (e.g. Newton, F=ma, Ohm, acceleration)...',
  },
  allTopics: {
    'uz-latn': 'Barcha bölimlar',
    'uz-cyrl': 'Барча бўлимлар',
    'ru': 'Все разделы',
    'en': 'All Topics',
  },
  useThisFormula: {
    'uz-latn': 'Formula bilan yeçiş',
    'uz-cyrl': 'Формула билан ечиш',
    'ru': 'Решить с этой формулой',
    'en': 'Solve with this formula',
  },
  variablesInFormula: {
    'uz-latn': 'Formuladagi kattaliklar:',
    'uz-cyrl': 'Формуладаги катталиклар:',
    'ru': 'Величины в формуле:',
    'en': 'Variables in formula:',
  },
  rearrangementsTitle: {
    'uz-latn': 'Formula keltirib çiqarişlari (Transformatsiyalar):',
    'uz-cyrl': 'Формула келтириб чиқаришлари (Трансформациялар):',
    'ru': 'Вывод величин (Преобразования):',
    'en': 'Formula rearrangements:',
  },

  // Examples
  examplesHeroTitle: {
    'uz-latn': 'Misollar va Masalalar Banki',
    'uz-cyrl': 'Мисоллар ва Масалалар Банки',
    'ru': 'Банк примеров и задач',
    'en': 'Problem and Example Bank',
  },
  tryExample: {
    'uz-latn': 'Buni yeçib körish',
    'uz-cyrl': 'Буни ечиб кўриш',
    'ru': 'Решить этот пример',
    'en': 'Solve this example',
  },

  // Common buttons & alerts
  clearInput: {
    'uz-latn': 'Tozalash',
    'uz-cyrl': 'Тозалаш',
    'ru': 'Очистить',
    'en': 'Clear',
  },
  mathToolbarTitle: {
    'uz-latn': 'Matematik belgilar va operatorlar',
    'uz-cyrl': 'Математик белгилар ва операторлар',
    'ru': 'Математические символы и операторы',
    'en': 'Mathematical symbols and operators',
  },

  // App UI Keys
  appSubtitle: {
    'uz-latn': 'Matematika va fizika boʻyicha qadamma-qadam yechish platformasi',
    'uz-cyrl': 'Математика ва физика бўйича қадамма-қадам ечиш платформаси',
    'ru': 'Платформа пошагового решения задач по математике и физике',
    'en': 'Step-by-step math and physics problem solving platform',
  },
  tabSolve: {
    'uz-latn': 'Yechish',
    'uz-cyrl': 'Ечиш',
    'ru': 'Решать',
    'en': 'Solve',
  },
  tabFormulas: {
    'uz-latn': 'Formulalar',
    'uz-cyrl': 'Формулалар',
    'ru': 'Формулы',
    'en': 'Formulas',
  },
  tabQuiz: {
    'uz-latn': 'Test & Mashq',
    'uz-cyrl': 'Тест & Машқ',
    'ru': 'Тест & Практика',
    'en': 'Quiz & Test',
  },
  tabConverter: {
    'uz-latn': 'SI Konverter',
    'uz-cyrl': 'СИ Конвертер',
    'ru': 'СИ Конвертер',
    'en': 'SI Converter',
  },
  tabVisualizer: {
    'uz-latn': 'Simulyator',
    'uz-cyrl': 'Симулятор',
    'ru': 'Симулятор',
    'en': 'Visualizer',
  },
  scanPhoto: {
    'uz-latn': 'Foto skaner',
    'uz-cyrl': 'Фото сканер',
    'ru': 'Фото сканер',
    'en': 'Photo OCR',
  },
  history: {
    'uz-latn': 'Tarix',
    'uz-cyrl': 'Тарих',
    'ru': 'История',
    'en': 'History',
  },
  virtualKeyboard: {
    'uz-latn': 'Klaviatura',
    'uz-cyrl': 'Клавиатура',
    'ru': 'Клавиатура',
    'en': 'Keyboard',
  },
  solve: {
    'uz-latn': 'Yechish',
    'uz-cyrl': 'Ечиш',
    'ru': 'Решить',
    'en': 'Solve',
  },
  stepByStep: {
    'uz-latn': 'Bosqichma-bosqich yechim',
    'uz-cyrl': 'Босқичма-босқич ечим',
    'ru': 'Пошаговое решение',
    'en': 'Step-by-Step Solution',
  },
};

export function getTranslation(
  arg1: Language | keyof typeof translations,
  arg2?: Language | keyof typeof translations
): string {
  let lang: Language = 'uz-latn';
  let key: keyof typeof translations;

  if (typeof arg1 === 'string' && (arg1 === 'uz-latn' || arg1 === 'uz-cyrl' || arg1 === 'ru' || arg1 === 'en')) {
    lang = arg1 as Language;
    key = (arg2 as keyof typeof translations) || 'brandName';
  } else {
    key = arg1 as keyof typeof translations;
    lang = (arg2 as Language) || 'uz-latn';
  }

  const item = translations[key];
  if (!item) return String(key);
  return item[lang] || item['en'] || String(key);
}

