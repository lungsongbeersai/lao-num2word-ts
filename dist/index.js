"use strict";
// index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberToWordsEN = numberToWordsEN;
exports.numberToWordsLA = numberToWordsLA;
// ====== Constants ======
var TEN = 10;
var ONE_HUNDRED = 100;
var ONE_THOUSAND = 1000;
var ONE_MILLION = 1000000;
var ONE_BILLION = 1000000000; // 1,000,000,000 (9)
var ONE_TRILLION = 1000000000000; // 1,000,000,000,000 (12)
var ONE_QUADRILLION = 1000000000000000; // 1,000,000,000,000,000 (15)
var MAX = 9007199254740992; // Number.MAX_SAFE_INTEGER (~9e15)
var LESS_THAN_TWENTY = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
var TENTHS_LESS_THAN_HUNDRED = [
    'zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];
// ====== Ordinal (EN) – simple helper ======
function makeOrdinal(words) {
    var _a;
    const parts = words.split(/[\s-]/);
    const last = (_a = parts[parts.length - 1]) !== null && _a !== void 0 ? _a : '';
    const irregular = {
        one: 'first', two: 'second', three: 'third', five: 'fifth',
        eight: 'eighth', nine: 'ninth', twelve: 'twelfth'
    };
    if (irregular[last]) {
        parts[parts.length - 1] = irregular[last];
    }
    else if (last.endsWith('y')) {
        parts[parts.length - 1] = last.slice(0, -1) + 'ieth';
    }
    else if (last) {
        parts[parts.length - 1] = last + 'th';
    }
    return parts.join(words.includes('-') ? '-' : ' ');
}
// ====== English ======
function numberToWordsEN(number, asOrdinal) {
    var words;
    var num = parseInt(String(number), 10);
    if (!isFinite(num))
        throw new TypeError('Not a finite number: ' + number + ' (' + typeof number + ')');
    words = generateWords(num);
    return asOrdinal ? makeOrdinal(words) : words;
}
function generateWords(number, words) {
    // ใช้ definite assignment assertion (!) เพื่อผ่าน strict
    var remainder, word;
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
        word = LESS_THAN_TWENTY[number];
    }
    else if (number < ONE_HUNDRED) {
        remainder = number % TEN;
        word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)];
        if (remainder) {
            word += '-' + LESS_THAN_TWENTY[remainder];
            remainder = 0;
        }
    }
    else if (number < ONE_THOUSAND) {
        remainder = number % ONE_HUNDRED;
        word = generateWords(Math.floor(number / ONE_HUNDRED)) + ' hundred';
    }
    else if (number < ONE_MILLION) {
        remainder = number % ONE_THOUSAND;
        word = generateWords(Math.floor(number / ONE_THOUSAND)) + ' thousand,';
    }
    else if (number < ONE_BILLION) {
        remainder = number % ONE_MILLION;
        word = generateWords(Math.floor(number / ONE_MILLION)) + ' million,';
    }
    else if (number < ONE_TRILLION) {
        remainder = number % ONE_BILLION;
        word = generateWords(Math.floor(number / ONE_BILLION)) + ' billion,';
    }
    else if (number < ONE_QUADRILLION) {
        remainder = number % ONE_TRILLION;
        word = generateWords(Math.floor(number / ONE_TRILLION)) + ' trillion,';
    }
    else if (number <= MAX) {
        remainder = number % ONE_QUADRILLION;
        word = generateWords(Math.floor(number / ONE_QUADRILLION)) + ' quadrillion,';
    }
    words.push(word);
    return generateWords(remainder, words);
}
// ====== Lao ======
function numberToWordsLA(num) {
    let n = typeof num === 'number' ? num : parseInt(String(num), 10);
    if (!Number.isFinite(n))
        throw new TypeError('Not a finite number: ' + num);
    if (n === 0)
        return "ສູນ";
    const negative = n < 0;
    const s = String(Math.abs(n));
    // ภายในกลุ่ม 6 หลัก: หน่วย(0) สิบ(1) ร้อย(2) พัน(3) หมื่น(4) แสน(5)
    const leveltext = ["", "ສິບ", "ຮ້ອຍ", "ພັນ", "ມື່ນ", "ແສນ"];
    const numtext = ["", "ໜຶ່ງ", "ສອງ", "ສາມ", "ສີ່", "ຫ້າ", "ຫົກ", "ເຈັດ", "ແປດ", "ເກົ້າ"];
    let res = "";
    let et = false; // มีหลักสิบ → หน่วย 1 ใช้ "ເອັດ"
    let chunkHasValue = false; // กลุ่ม 6 หลักนี้มีค่า ≠ 0 หรือไม่
    for (let i = 0; i < s.length; i++) {
        const val = parseInt(s.charAt(i), 10);
        const pos = s.length - i - 1;
        const mod = pos % leveltext.length; // 0..5
        if (val > 0) {
            chunkHasValue = true;
            if (mod === 1) {
                // หลักสิบ (10..90) — 20 ใช้ "ຊາວ"
                if (val === 1)
                    res += "ສິບ";
                else if (val === 2)
                    res += "ຊາວ";
                else
                    res += numtext[val] + "ສິບ";
                et = true; // ให้หน่วย 1 เป็น "ເອັດ"
            }
            else if (mod === 0) {
                // หลักหน่วย
                if (et && val === 1)
                    res += "ເອັດ";
                else
                    res += numtext[val];
                et = false;
            }
            else if (mod === 2) {
                // ຮ້ອຍ — ใส่ "ໜຶ່ງ" เมื่อ val=1
                res += (val === 1 ? "ໜຶ່ງ" : numtext[val]) + "ຮ້ອຍ";
            }
            else if (mod === 3) {
                // ພັນ — ใส่ "ໜຶ່ງພັນ" เมื่อ val=1
                res += (val === 1 ? "ໜຶ່ງ" : numtext[val]) + "ພັນ";
            }
            else if (mod === 4) {
                // ໝື່ນ — 10k = "ໜຶ່ງໝື່ນ", 20k = "ສອງໝື່ນ"
                res += (val === 1 ? "ໜຶ່ງ" : numtext[val]) + "ໝື່ນ";
            }
            else if (mod === 5) {
                // ແສນ — 100k = "ໜຶ່ງແສນ"
                res += (val === 1 ? "ໜຶ່ງ" : numtext[val]) + "ແສນ";
            }
        }
        else {
            if (mod === 1)
                et = false; // ศูนย์ในหลักสิบ → ยกเลิก "ເອັດ"
        }
        // คั่น "ລ້ານ" เมื่อจบกลุ่ม 6 หลักที่มีค่า และยังมีหลักถัดไป
        if (mod === 0 && pos > 0) {
            if (chunkHasValue)
                res += "ລ້ານ";
            chunkHasValue = false;
            et = false; // กันไม่ให้สถานะหลักสิบลามไปกลุ่มใหม่
        }
    }
    if (negative)
        res = "ລົບ" + res;
    return res || "ສູນ";
}
//# sourceMappingURL=index.js.map