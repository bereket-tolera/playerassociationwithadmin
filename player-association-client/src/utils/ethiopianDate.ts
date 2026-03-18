/**
 * Gregorian → Ethiopian Calendar converter
 * Ethiopian calendar is ~7-8 years behind GC.
 * Months: 12 months of 30 days + 1 intercalary month (Pagume) of 5/6 days.
 */

const ET_MONTHS_AM = [
  "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ",
  "ጥር", "የካቲት", "መጋቢት", "ሚያዚያ",
  "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ",
];

const ET_MONTHS_EN = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas",
  "Tir", "Yekatit", "Megabit", "Miyazia",
  "Ginbot", "Sene", "Hamle", "Nehase", "Pagume",
];

const ET_DAYS_AM = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

/** Convert a JS Date (GC) to Ethiopian date components */
export function gcToEthiopian(date: Date): { year: number; month: number; day: number } {
  const jdn = gcToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return jdnToEthiopian(jdn);
}

function gcToJDN(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  return d + Math.floor((153 * mo + 2) / 5) + 365 * yr +
    Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
}

function jdnToEthiopian(jdn: number): { year: number; month: number; day: number } {
  const r = (jdn - 1723856) % 1461;
  const n = r % 365 + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  return { year, month: Math.min(month, 13), day };
}

/**
 * Format a GC date as Ethiopian calendar string.
 * @param date  JS Date object
 * @param lang  "am" for Amharic labels, "en" for English transliteration
 * @param includeDay  include weekday name
 */
export function formatEthiopianDate(
  date: Date,
  lang: "am" | "en" = "am",
  includeDay = false
): string {
  const { year, month, day } = gcToEthiopian(date);
  const monthName = lang === "am" ? ET_MONTHS_AM[month - 1] : ET_MONTHS_EN[month - 1];
  const dayName = lang === "am" ? ET_DAYS_AM[date.getDay()] : "";
  const yearSuffix = lang === "am" ? " ዓ.ም" : "";

  if (includeDay && lang === "am") {
    return `${dayName}፣ ${day} ${monthName} ${year}${yearSuffix}`;
  }
  return `${day} ${monthName} ${year}${yearSuffix}`;
}

/** Short format: "15 መስከረም" */
export function formatEthiopianShort(date: Date, lang: "am" | "en" = "am"): string {
  const { month, day } = gcToEthiopian(date);
  const monthName = lang === "am" ? ET_MONTHS_AM[month - 1] : ET_MONTHS_EN[month - 1];
  return `${day} ${monthName}`;
}

/** Just the Ethiopian month name */
export function ethiopianMonthName(date: Date, lang: "am" | "en" = "am"): string {
  const { month } = gcToEthiopian(date);
  return lang === "am" ? ET_MONTHS_AM[month - 1] : ET_MONTHS_EN[month - 1];
}

/** Just the Ethiopian day number */
export function ethiopianDay(date: Date): number {
  return gcToEthiopian(date).day;
}

/** Just the Ethiopian year */
export function ethiopianYear(date: Date): number {
  return gcToEthiopian(date).year;
}
