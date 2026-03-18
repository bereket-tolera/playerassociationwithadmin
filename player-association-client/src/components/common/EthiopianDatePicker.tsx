import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

/**
 * Ethiopian Calendar Date Picker
 * - Displays Ethiopian calendar UI
 * - Returns value as GC ISO string (YYYY-MM-DD) for backend compatibility
 * - Accepts value as GC ISO string
 */

const ET_MONTHS = [
  "መስከረም","ጥቅምት","ህዳር","ታህሳስ",
  "ጥር","የካቲት","መጋቢት","ሚያዚያ",
  "ግንቦት","ሰኔ","ሐምሌ","ነሐሴ","ጳጉሜ",
];

const ET_DAYS_SHORT = ["እሑ","ሰኞ","ማክ","ረቡ","ሐሙ","ዓር","ቅዳ"];

// ── Conversion helpers ──────────────────────────────────────────────────────

function gcToJDN(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  return d + Math.floor((153 * mo + 2) / 5) + 365 * yr +
    Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
}

function jdnToEt(jdn: number): { year: number; month: number; day: number } {
  const r = (jdn - 1723856) % 1461;
  const n = r % 365 + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.min(Math.floor(n / 30) + 1, 13);
  const day = (n % 30) + 1;
  return { year, month, day };
}

function etToJDN(y: number, m: number, d: number): number {
  return 1723856 + 365 * (y - 1) + Math.floor(y / 4) + 30 * (m - 1) + d - 1;
}

function jdnToGC(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor(146097 * b / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

function gcIsoToEt(iso: string): { year: number; month: number; day: number } | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return jdnToEt(gcToJDN(y, m, d));
}

function etToGcIso(y: number, m: number, d: number): string {
  const jdn = etToJDN(y, m, d);
  const gc = jdnToGC(jdn);
  return `${gc.year}-${String(gc.month).padStart(2, "0")}-${String(gc.day).padStart(2, "0")}`;
}

function todayEt(): { year: number; month: number; day: number } {
  const now = new Date();
  return jdnToEt(gcToJDN(now.getFullYear(), now.getMonth() + 1, now.getDate()));
}

function daysInEtMonth(month: number, year: number): number {
  if (month <= 12) return 30;
  // Pagume: 6 days in leap year (every 4th year), else 5
  return year % 4 === 3 ? 6 : 5;
}

// Day of week for 1st of ET month (0=Sun)
function firstDayOfWeek(etYear: number, etMonth: number): number {
  const jdn = etToJDN(etYear, etMonth, 1);
  const gc = jdnToGC(jdn);
  return new Date(gc.year, gc.month - 1, gc.day).getDay();
}

// ── Component ───────────────────────────────────────────────────────────────

interface Props {
  value: string;           // GC ISO "YYYY-MM-DD"
  onChange: (gcIso: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function EthiopianDatePicker({ value, onChange, label, required, className }: Props) {
  const today = todayEt();
  const initEt = gcIsoToEt(value) ?? today;

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initEt.year);
  const [viewMonth, setViewMonth] = useState(initEt.month);
  const [selected, setSelected] = useState<{ year: number; month: number; day: number } | null>(
    value ? initEt : null
  );
  const ref = useRef<HTMLDivElement>(null);

  // Sync if external value changes
  useEffect(() => {
    const et = gcIsoToEt(value);
    if (et) {
      setSelected(et);
      setViewYear(et.year);
      setViewMonth(et.month);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectDay = (day: number) => {
    const et = { year: viewYear, month: viewMonth, day };
    setSelected(et);
    onChange(etToGcIso(et.year, et.month, et.day));
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(13); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 13) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const days = daysInEtMonth(viewMonth, viewYear);
  const firstDow = firstDayOfWeek(viewYear, viewMonth);
  const displayText = selected
    ? `${selected.day} ${ET_MONTHS[selected.month - 1]} ${selected.year} ዓ.ም`
    : "ቀን ይምረጡ";

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      {label && (
        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">
          {label} {required && <span className="text-[#E30613]">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm transition-all text-left"
      >
        <span className={selected ? "text-gray-900 font-semibold" : "text-gray-400"}>
          {displayText}
        </span>
        <Calendar size={15} className="text-gray-400 flex-shrink-0" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
            <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
              <ChevronLeft size={14} className="text-gray-600" />
            </button>
            <div className="text-center">
              <p className="text-sm font-black text-gray-900">{ET_MONTHS[viewMonth - 1]}</p>
              <p className="text-[10px] font-bold text-[#009A44]">{viewYear} ዓ.ም</p>
            </div>
            <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
              <ChevronRight size={14} className="text-gray-600" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {ET_DAYS_SHORT.map(d => (
              <div key={d} className="text-center text-[9px] font-black text-gray-400 uppercase py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}

            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const isSelected = selected?.year === viewYear && selected?.month === viewMonth && selected?.day === day;
              const isToday = today.year === viewYear && today.month === viewMonth && today.day === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`
                    h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs font-bold transition-all
                    ${isSelected
                      ? "bg-[#009A44] text-white shadow-sm"
                      : isToday
                        ? "border border-[#009A44] text-[#009A44]"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={() => {
                setViewYear(today.year);
                setViewMonth(today.month);
                selectDay(today.day);
              }}
              className="w-full py-2 text-[10px] font-black text-[#009A44] uppercase tracking-widest hover:bg-[#009A44]/5 rounded-xl transition-colors border border-[#009A44]/20"
            >
              ዛሬ — {today.day} {ET_MONTHS[today.month - 1]} {today.year}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
