# lao-num2word-ts

[![npm version](https://img.shields.io/npm/v/lao-num2word-ts.svg)](https://www.npmjs.com/package/lao-num2word-ts)
[![npm downloads](https://img.shields.io/npm/dm/lao-num2word-ts.svg)](https://www.npmjs.com/package/lao-num2word-ts)
[![license: MIT](https://img.shields.io/badge/license-MIT-green.svg)](#license)

Convert numbers to **Lao** words and **English** words — written in **TypeScript**, ships with typings.

> **Highlights**
>
> - Lao rules (ໜຶ່ງ, ຊາວ, ເອັດ, ລ້ານ grouping)
> - English cardinals + **ordinals** (`asOrdinal`)  
> - TypeScript-first, zero deps, CommonJS/ESM compatible  
> - Safe range: ±`Number.MAX_SAFE_INTEGER` (≈ 9e15)

---

## Install

```bash
npm install lao-num2word-ts
# or
yarn add lao-num2word-ts
# or
pnpm add lao-num2word-ts
# or
bun add lao-num2word-ts

#Quick Start
#CommonJS

const { numberToWordsLA, numberToWordsEN } = require("lao-num2word-ts");

console.log(numberToWordsLA(11000)); // ໜຶ່ງໝື່ນໜຶ່ງພັນ
console.log(numberToWordsEN(11000)); // eleven thousand


#ESM / TypeScript
import { numberToWordsLA, numberToWordsEN } from "lao-num2word-ts";

console.log(numberToWordsLA(21));       // ຊາວເອັດ
console.log(numberToWordsEN(21));       // twenty-one
console.log(numberToWordsEN(21, true)); // twenty-first (ordinal)

