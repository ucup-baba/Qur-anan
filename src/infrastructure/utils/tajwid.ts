/**
 * Tajwid rule highlighter — simplified heuristic.
 * Detects common rules per-letter: ghunnah, qalqalah, ikhfa, idgham, iqlab, madd.
 * Not a full Tajwid parser; approximates common cases for pedagogical highlighting.
 */

export type TajwidRule =
  | 'ghunnah'
  | 'qalqalah'
  | 'ikhfa'
  | 'idgham'
  | 'iqlab'
  | 'madd';

export interface TajwidSegment {
  text: string;
  rule?: TajwidRule;
}

const LETTER_RE = /[ء-يٱ-ۓ]/;
const MARK_RE = /[ً-ٰٟۖ-ۭ]/;
const SHADDA = 'ّ';
const SUKUN = 'ْ';
const TANWIN_RE = /[ًٌٍ]/;

const IKHFA_LETTERS = new Set(['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك']);
const IDGHAM_LETTERS = new Set(['ي', 'ر', 'م', 'ل', 'و', 'ن']);
const IQLAB_LETTERS = new Set(['ب']);
const QALQALAH_LETTERS = new Set(['ق', 'ط', 'ب', 'ج', 'د']);
const MADD_LETTERS = new Set(['ا', 'و', 'ي', 'ى']);

interface Unit {
  letter: string;
  marks: string;
  isLetter: boolean;
}

function tokenize(text: string): Unit[] {
  const out: Unit[] = [];
  const chars = Array.from(text);
  let i = 0;
  while (i < chars.length) {
    const c = chars[i];
    if (LETTER_RE.test(c)) {
      let marks = '';
      i++;
      while (i < chars.length && MARK_RE.test(chars[i])) {
        marks += chars[i];
        i++;
      }
      out.push({ letter: c, marks, isLetter: true });
    } else {
      out.push({ letter: c, marks: '', isLetter: false });
      i++;
    }
  }
  return out;
}

function nextArabicLetter(units: Unit[], from: number): Unit | null {
  for (let k = from; k < units.length; k++) {
    if (units[k].isLetter) return units[k];
  }
  return null;
}

export function segmentTajwid(text: string): TajwidSegment[] {
  const units = tokenize(text);
  const segments: TajwidSegment[] = [];

  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    let rule: TajwidRule | undefined;

    if (!u.isLetter) {
      segments.push({ text: u.letter });
      continue;
    }

    const hasShadda = u.marks.includes(SHADDA);
    const hasSukun = u.marks.includes(SUKUN);
    const hasTanwin = TANWIN_RE.test(u.marks);

    if ((u.letter === 'ن' || u.letter === 'م') && hasShadda) {
      rule = 'ghunnah';
    } else if (QALQALAH_LETTERS.has(u.letter) && hasSukun) {
      rule = 'qalqalah';
    } else if ((u.letter === 'ن' && hasSukun) || hasTanwin) {
      const next = nextArabicLetter(units, i + 1);
      if (next) {
        if (IQLAB_LETTERS.has(next.letter)) rule = 'iqlab';
        else if (IDGHAM_LETTERS.has(next.letter)) rule = 'idgham';
        else if (IKHFA_LETTERS.has(next.letter)) rule = 'ikhfa';
      }
    } else if (u.marks.includes('ٰ')) {
      // Superscript alef (dagger alef) — mad
      rule = 'madd';
    } else if (MADD_LETTERS.has(u.letter) && hasShadda) {
      rule = 'madd';
    } else if (MADD_LETTERS.has(u.letter) && !u.marks && i > 0) {
      // Bare mad letter (alif/waw/ya/alif maqsura) without harakat → mad tabi'i heuristic
      rule = 'madd';
    }

    segments.push({ text: u.letter + u.marks, rule });
  }

  return mergePlain(segments);
}

function mergePlain(segments: TajwidSegment[]): TajwidSegment[] {
  const out: TajwidSegment[] = [];
  for (const s of segments) {
    const last = out[out.length - 1];
    if (last && !last.rule && !s.rule) {
      last.text += s.text;
    } else {
      out.push({ ...s });
    }
  }
  return out;
}

export const TAJWID_LEGEND: { rule: TajwidRule; label: string; color: string; description: string }[] = [
  { rule: 'ghunnah', label: 'Ghunnah', color: '#e91e63', description: 'Dengung pada nun/mim bertasydid' },
  { rule: 'ikhfa', label: 'Ikhfa', color: '#ff9800', description: 'Nun mati/tanwin + huruf ikhfa' },
  { rule: 'idgham', label: 'Idgham', color: '#2196f3', description: 'Nun mati/tanwin + huruf idgham' },
  { rule: 'iqlab', label: 'Iqlab', color: '#9c27b0', description: 'Nun mati/tanwin + ب' },
  { rule: 'qalqalah', label: 'Qalqalah', color: '#009688', description: 'ق ط ب ج د bersukun' },
  { rule: 'madd', label: 'Madd', color: '#8d4e85', description: 'Mad bertasydid' },
];

export const TAJWID_COLORS: Record<TajwidRule, string> = Object.fromEntries(
  TAJWID_LEGEND.map((l) => [l.rule, l.color])
) as Record<TajwidRule, string>;
