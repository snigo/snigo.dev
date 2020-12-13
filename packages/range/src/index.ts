import { mod, round } from '@snigo.dev/mathx';
import {
  checkLength,
  maxPrecision,
  normalizeStep,
  RangeCallback,
} from './utils';

class Range {
  readonly from: number | undefined = undefined;

  readonly to: number | undefined = undefined;

  readonly step: number | undefined = undefined;

  /**
   * If only one argument provided the output will be
   * [0 ... number] range
   *
   * @param {number} rangeStart Number the range will start with
   * @param {number} rangeEnd Number the range will end on, including this number
   * @param {number} step Step size, default to 1
   */
  constructor(rangeStart?: number, rangeEnd?: number, step: number = 1) {
    const from = arguments.length > 1 ? +(rangeStart || 0) : 0;
    const to = arguments.length > 1 ? +(rangeEnd || 0) : +(rangeStart || 0);
    if (Number.isNaN(from) || Number.isNaN(to) || !arguments.length) return this;
    const normalizedStep = normalizeStep(step);
    Object.defineProperties(this, {
      from: {
        value: from,
        enumerable: true,
        configurable: false,
        writable: false,
      },
      to: {
        value: to,
        enumerable: true,
        configurable: false,
        writable: false,
      },
      step: {
        value: normalizedStep,
        enumerable: true,
        configurable: false,
        writable: false,
      },
    });
  }

  /**
   * Standard iterator using JS built-in Symbol.iterator
   * Creates default iteration behavior and ability of using
   * Range instances with for...of loops or spread operators:
   * range = new Range(3);
   * [...range]; // [0, 1, 2, 3]
   *
   * It will try to account for presicion errors
   */
  * [Symbol.iterator]() {
    checkLength(this);
    if (this.from === undefined || this.to === undefined || this.step === undefined) return [];

    const isAsc = this.from <= this.to;
    const _p = maxPrecision([this.step, this.from, this.to]);

    for (
      let i = this.from;
      isAsc ? i <= this.to : i >= this.to;
      i = round((isAsc ? i + this.step : i - this.step), _p)
    ) {
      yield i;
    }
    return undefined;
  }

  /**
   * @static
   *
   * Creates range from any array-like (iterable) structure holding numbers:
   * ```
   * const arr = [7, 6, 5, 42, 16, 9];
   * Range.from(arr); // Range {5...42}
   * ```
   *
   * @param {any} iterableNumbers Any iterable structure holding numbers
   */
  static from(iterableNumbers: number[] | Set<number>) {
    if (iterableNumbers == null) return new Range();
    if (typeof iterableNumbers[Symbol.iterator] !== 'function') return new Range();
    if (iterableNumbers instanceof Set && !iterableNumbers.size) return new Range();
    if (iterableNumbers instanceof Array && !iterableNumbers.length) return new Range();
    if (iterableNumbers instanceof String && !iterableNumbers.length) return new Range();

    const min = Math.min(...iterableNumbers);
    const max = Math.max(...iterableNumbers);

    if (Number.isNaN(min) || Number.isNaN(max)) return new Range();

    return new Range(min, max);
  }

  /**
   * Executes provided function on every element of the range
   * with provided step. If no step provided initial this.step will be used
   * Similarly to forEach in Array, following arguments will be passed to callback:
   * - currentValue
   * - index
   * - range
   * Will try to account for precision errors between numbers in the range
   *
   * @param {function} fn Function to be executed on every number in the range
   * @param {number} step Optional step, if different from initial range step
   */
  forEach(fn: RangeCallback, step = this.step) {
    if (
      this.from === undefined
      || this.to === undefined
      || this.step === undefined
    ) return undefined;
    checkLength(this);
    const normalizedStep = normalizeStep(step);
    const isAsc = this.from <= this.to;
    const _p = maxPrecision([normalizedStep, this.from, this.to]);
    let count = 0;
    for (
      let i = this.from;
      isAsc ? i <= this.to : i >= this.to;
      i = round((isAsc ? i + normalizedStep : i - normalizedStep), _p)
    ) {
      fn(i, count, this);
      count += 1;
    }

    return undefined;
  }

  /**
   * Similarly to Range.prototype.forEach iterates through every number
   * in the range executing provided function backwards (to -> from)
   *
   * @param {function} fn Function to be executed on every number in the range
   * @param {number} step Optional step, if different from initial range step
   */
  forEachReverse(fn: RangeCallback, step = this.step) {
    if (
      this.from === undefined
      || this.to === undefined
      || this.step === undefined
    ) return undefined;
    checkLength(this);
    const normalizedStep = normalizeStep(step);

    const isAsc = this.from <= this.to;
    const _p = maxPrecision([normalizedStep, this.from, this.to]);
    let count = 0;
    for (
      let i = this.to;
      isAsc ? i >= this.from : i <= this.from;
      i = round((isAsc ? i - normalizedStep : i + normalizedStep), _p)
    ) {
      fn(i, count, this);
      count += 1;
    }

    return undefined;
  }

  /**
   * Returns total number of items in the range.
   * The length of the resulting array when toArray() method invoked
   */
  get length(): number {
    if (this.to === undefined || this.from === undefined || this.step === undefined) return 0;
    return Math.round(Math.abs(this.to - this.from) / this.step) + 1;
  }

  /**
   * Returns largest number in the range.
   */
  get max(): number {
    if (this.from === undefined || this.to === undefined) return NaN;
    return this.from <= this.to ? this.to : this.from;
  }

  /**
   * Returns lowest number in the range.
   */
  get min(): number {
    if (this.from === undefined || this.to === undefined) return NaN;
    return this.from <= this.to ? this.from : this.to;
  }

  /**
   * Returns central number in the range:
   * const range = new Range(-100, 100);
   * range.center; // 0
   */
  get center(): number {
    if (this.to === undefined || this.from === undefined) return NaN;
    return this.min + (this.max - this.min) / 2;
  }

  /**
   * Returns boolean indicating whether number within a range
   *
   * @param {number} number Number to be checked
   */
  has(number: number): boolean {
    return (+number >= this.min) && (+number <= this.max);
  }

  /**
   * Similarly to _.clamp(), ensures resulting number is in the range:
   * const range = new Range(100);
   * range.clamp(120); // 100
   * range.clamp(-Infinity); // 0
   *
   * @param {number} number Number to be clamped
   */
  clamp(number: number): number {
    if (+number < this.min) return this.min;
    if (+number > this.max) return this.max;
    return +number;
  }

  /**
   * Converts range to array of numbers with initial range step
   */
  toArray(): number[] {
    return [...this];
  }

  /**
   * Returns distance of number relative to the range:
   * ```
   * const range = new Range(-100, 100);
   * range.getFraction(0); // 0.5 (aka 50%)
   * range.getFraction(-150); // -0.25
   * range.getFraction(400); // 2.5
   * ```
   *
   * @param {number} number Number to be checked
   * @param {number} precision Output precision, defaults to 12
   */
  getFraction(number: number, precision: number = 12): number {
    if (Number.isNaN(+precision) || +precision < 0) return NaN;
    return round((+number - this.min) / (this.max - this.min), precision);
  }

  /**
   * Inverse from getFraction, returns number with given precision relative
   * to provided fraction of the range:
   * ```
   * const range = new Range(-100, 100);
   * range.fromFraction(0); // -100
   * range.fromFraction(.5); // 0
   * range.fromFraction(1); // 100
   * ```
   *
   * @param {number} number Fraction
   * @param {number} precision Output precision, defaults to 12
   */
  fromFraction(number: number, precision: number = 12): number {
    return round(this.min + +number * (this.max - this.min), precision);
  }

  /**
   * Slices range into provided number of equal parts.
   * Returns array of numbers representing boundaries of each slice
   * For example, slice circle into 6 parts:
   * const range = new Range(0, 359);
   * range.slice(6); // [0, 60, 120, 180, 240, 300]
   *
   * @param {number} parts Number of parts range ro be sliced to
   */
  slice(parts: number): number[] {
    if (!parts || this.step === undefined) return [];

    const step = round((this.max - this.min + this.step) / parts);
    const output: number[] = [];
    this.forEach((number: number) => output.push(number), step);

    return output;
  }

  /**
   * Returns number in the range, such as number = input mod range:
   * const range = new Range(0, 9);
   * range.mod(0); // 0
   * range.mod(-2); // 8
   * range.mod(23); // 3
   *
   * @param {number} number Number to be checked
   */
  mod(number: number): number {
    return this.min + mod(+number, this.max - this.min + 1);
  }
}

export default Range;
