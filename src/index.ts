// index.ts

// ====== Constants ======
var TEN: number = 10;
var ONE_HUNDRED: number = 100;
var ONE_THOUSAND: number = 1000;
var ONE_MILLION: number = 1_000_000;
var ONE_BILLION: number = 1_000_000_000;           // 1,000,000,000 (9)
var ONE_TRILLION: number = 1_000_000_000_000;       // 1,000,000,000,000 (12)
var ONE_QUADRILLION: number = 1_000_000_000_000_000; // 1,000,000,000,000,000 (15)
var MAX: number = 9_007_199_254_740_992;            // Number.MAX_SAFE_INTEGER (~9e15)

var LESS_THAN_TWENTY: string[] = [
  'zero','one','two','three','four','five','six','seven','eight','nine','ten',
  'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'
];

var TENTHS_LESS_THAN_HUNDRED: string[] = [
  'zero','ten','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'
];

// ====== Ordinal (EN) – simple helper ======
function makeOrdinal(words: string): string {
  const parts = words.split(/[\s-]/);
  const last = parts[parts.length - 1] ?? '';
  const irregular: Record<string, string> = {
    one: 'first', two: 'second', three: 'third', five: 'fifth',
    eight: 'eighth', nine: 'ninth', twelve: 'twelfth'
  };
  if (irregular[last]) {
    parts[parts.length - 1] = irregular[last];
  } else if (last.endsWith('y')) {
    parts[parts.length - 1] = last.slice(0, -1) + 'ieth';
  } else if (last) {
    parts[parts.length - 1] = last + 'th';
  }
  return parts.join(words.includes('-') ? '-' : ' ');
}

// ====== English ======
function numberToWordsEN(number: number | string, asOrdinal?: boolean): string {
  var words: string;
  var num: number = parseInt(String(number), 10);
  if (!isFinite(num)) throw new TypeError('Not a finite number: ' + number + ' (' + typeof number + ')');
  words = generateWords(num);
  return asOrdinal ? makeOrdinal(words) : words;
}

function generateWords(number: number, words?: string[]): string {
  // ใช้ definite assignment assertion (!) เพื่อผ่าน strict
  var remainder!: number, word!: string;

  if (number === 0) {
    return !words ? 'zero' : words.join(' ').replace(/,$/, '');
  }
  if (!words) {
    words = [];
  }
  if (number < 0) {
    words.push('minus');
    number = Math.abs(number);
  }
  if (number < 20) {
    remainder = 0;
    word = LESS_THAN_TWENTY[number]!;
  } else if (number < ONE_HUNDRED) {
    remainder = number % TEN;
    word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)]!;
    if (remainder) {
      word += '-' + LESS_THAN_TWENTY[remainder]!;
      remainder = 0;
    }
  } else if (number < ONE_THOUSAND) {
    remainder = number % ONE_HUNDRED;
    word = generateWords(Math.floor(number / ONE_HUNDRED)) + ' hundred';
  } else if (number < ONE_MILLION) {
    remainder = number % ONE_THOUSAND;
    word = generateWords(Math.floor(number / ONE_THOUSAND)) + ' thousand,';
  } else if (number < ONE_BILLION) {
    remainder = number % ONE_MILLION;
    word = generateWords(Math.floor(number / ONE_MILLION)) + ' million,';
  } else if (number < ONE_TRILLION) {
    remainder = number % ONE_BILLION;
    word = generateWords(Math.floor(number / ONE_BILLION)) + ' billion,';
  } else if (number < ONE_QUADRILLION) {
    remainder = number % ONE_TRILLION;
    word = generateWords(Math.floor(number / ONE_TRILLION)) + ' trillion,';
  } else if (number <= MAX) {
    remainder = number % ONE_QUADRILLION;
    word = generateWords(Math.floor(number / ONE_QUADRILLION)) + ' quadrillion,';
  }
  words.push(word);
  return generateWords(remainder, words);
}

// ====== Lao ======
function numberToWordsLA(num: number | string): string {
  let n = typeof num === 'number' ? num : parseInt(String(num), 10);
  if (!Number.isFinite(n)) throw new TypeError('Not a finite number: ' + num);
  if (n === 0) return "ສູນ";

  const negative = n < 0;
  const s = String(Math.abs(n));

  // ภายในกลุ่ม 6 หลัก: หน่วย(0) สิบ(1) ร้อย(2) พัน(3) หมื่น(4) แสน(5)
  const leveltext = ["", "ສິບ", "ຮ້ອຍ", "ພັນ", "ມື່ນ", "ແສນ"] as const;
  const numtext   = ["", "ໜຶ່ງ", "ສອງ", "ສາມ", "ສີ່", "ຫ້າ", "ຫົກ", "ເຈັດ", "ແປດ", "ເກົ້າ"] as const;

  let res = "";
  let et = false;            // มีหลักสิบ → หน่วย 1 ใช้ "ເອັດ"
  let chunkHasValue = false; // กลุ่ม 6 หลักนี้มีค่า ≠ 0 หรือไม่

  for (let i = 0; i < s.length; i++) {
    const val = parseInt(s.charAt(i), 10);
    const pos = s.length - i - 1;
    const mod = pos % leveltext.length; // 0..5

    if (val > 0) {
      chunkHasValue = true;

      if (mod === 1) {
        // หลักสิบ (10..90) — 20 ใช้ "ຊາວ"
        if (val === 1)       res += "ສິບ";
        else if (val === 2)  res += "ຊາວ";
        else                 res += numtext[val]! + "ສິບ";
        et = true; // ให้หน่วย 1 เป็น "ເອັດ"
      } else if (mod === 0) {
        // หลักหน่วย
        if (et && val === 1) res += "ເອັດ";
        else                 res += numtext[val]!;
        et = false;
      } else if (mod === 2) {
        // ຮ້ອຍ — ใส่ "ໜຶ່ງ" เมื่อ val=1
        res += (val === 1 ? "ໜຶ່ງ" : numtext[val]!) + "ຮ້ອຍ";
      } else if (mod === 3) {
        // ພັນ — ใส่ "ໜຶ່ງພັນ" เมื่อ val=1
        res += (val === 1 ? "ໜຶ່ງ" : numtext[val]!) + "ພັນ";
      } else if (mod === 4) {
        // ໝື່ນ — 10k = "ໜຶ່ງໝື່ນ", 20k = "ສອງໝື່ນ"
        res += (val === 1 ? "ໜຶ່ງ" : numtext[val]!) + "ໝື່ນ";
      } else if (mod === 5) {
        // ແສນ — 100k = "ໜຶ່ງແສນ"
        res += (val === 1 ? "ໜຶ່ງ" : numtext[val]!) + "ແສນ";
      }
    } else {
      if (mod === 1) et = false; // ศูนย์ในหลักสิบ → ยกเลิก "ເອັດ"
    }

    // คั่น "ລ້ານ" เมื่อจบกลุ่ม 6 หลักที่มีค่า และยังมีหลักถัดไป
    if (mod === 0 && pos > 0) {
      if (chunkHasValue) res += "ລ້ານ";
      chunkHasValue = false;
      et = false; // กันไม่ให้สถานะหลักสิบลามไปกลุ่มใหม่
    }
  }

  if (negative) res = "ລົບ" + res;
  return res || "ສູນ";
}

// Exports (ES Module)
export { numberToWordsEN, numberToWordsLA };
