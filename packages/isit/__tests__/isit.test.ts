// @ts-nocheck
/* eslint-disable no-new-wrappers */
/* eslint-disable symbol-description */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
/* eslint-disable no-new-func */
/* eslint-disable func-names */
import {
  isAnyNumber,
  isArrow,
  isBoolean,
  isConstructor,
  isDate,
  isDateLike,
  isFunction,
  isIterable,
  isNullish,
  isNumberLike,
  isNumber,
  isPromise,
  isString,
  isSymbol,
} from '../src';

const arrowFn = () => {};
const fn = function (cb = () => {}) {};
const obj = {
  a: () => {},
  f() {},
};
class Person {}

test('isArrow function', () => {
  expect(isArrow(arrowFn)).toBe(true);
  expect(isArrow(fn)).toBe(false);
  expect(isArrow(obj.a)).toBe(true);
  expect(isArrow(obj.f)).toBe(false);
  expect(isArrow()).toBe(false);
  expect(isArrow(null)).toBe(false);
  expect(isArrow(45)).toBe(false);
  expect(isArrow('string')).toBe(false);
  expect(isArrow(new Function())).toBe(false);
});

test('isConstructor function', () => {
  expect(isConstructor(arrowFn)).toBe(false);
  expect(isConstructor(fn)).toBe(true);
  expect(isConstructor(obj.a)).toBe(false);
  expect(isConstructor(obj.f)).toBe(false);
  expect(isConstructor(Person)).toBe(true);
  expect(isConstructor()).toBe(false);
  expect(isConstructor(null)).toBe(false);
  expect(isConstructor(Number)).toBe(true);
  expect(isConstructor(Array)).toBe(true);
  expect(isConstructor(Date)).toBe(true);
  expect(isConstructor(Reflect)).toBe(false);
  expect(isConstructor(45)).toBe(false);
  expect(isConstructor('string')).toBe(false);
  expect(isConstructor(new Function())).toBe(true);
});

test('isFunction function', () => {
  expect(isFunction(arrowFn)).toBe(true);
  expect(isFunction(fn)).toBe(true);
  expect(isFunction(obj.a)).toBe(true);
  expect(isFunction(obj.f)).toBe(true);
  expect(isFunction(Person)).toBe(true);
  expect(isFunction()).toBe(false);
  expect(isFunction(null)).toBe(false);
  expect(isFunction(Number)).toBe(true);
  expect(isFunction(Array)).toBe(true);
  expect(isFunction(Date)).toBe(true);
  expect(isFunction(Reflect)).toBe(false);
  expect(isFunction(45)).toBe(false);
  expect(isFunction('string')).toBe(false);
  expect(isFunction(new Function())).toBe(true);
});

test('isIterable function', () => {
  expect(isIterable(arrowFn)).toBe(false);
  expect(isIterable(fn)).toBe(false);
  expect(isIterable(obj.a)).toBe(false);
  expect(isIterable(obj.f)).toBe(false);
  expect(isIterable(Person)).toBe(false);
  expect(isIterable()).toBe(false);
  expect(isIterable(null)).toBe(false);
  expect(isIterable(45)).toBe(false);
  expect(isIterable('string')).toBe(true);
  expect(isIterable([1, 2, 3])).toBe(true);
  expect(isIterable(new Map())).toBe(true);
  expect(isIterable(new Set([1, 2, 3]))).toBe(true);
  expect(isIterable({ 0: 1, length: 1 })).toBe(false);
});

test('isNullish function', () => {
  expect(isNullish(arrowFn)).toBe(false);
  expect(isNullish(obj)).toBe(false);
  expect(isNullish()).toBe(true);
  expect(isNullish(null)).toBe(true);
  expect(isNullish(undefined)).toBe(true);
  expect(isNullish(0)).toBe(false);
  expect(isNullish('')).toBe(false);
  expect(isNullish([])).toBe(false);
  expect(isNullish(false)).toBe(false);
  expect(isNullish('null')).toBe(false);
  expect(isNullish({})).toBe(false);
});

test('isPromise function', () => {
  expect(isPromise(Promise)).toBe(false);
  expect(isPromise(new Promise((r) => r(1)))).toBe(true);
  expect(isPromise()).toBe(false);
  expect(isPromise((async () => {})())).toBe(true);
});

test('isSymbol function', () => {
  expect(isSymbol(Symbol)).toBe(false);
  expect(isSymbol(Symbol())).toBe(true);
  expect(isSymbol()).toBe(false);
  expect(isSymbol(Symbol('not a symbol'))).toBe(true);
});

test('isBoolean function', () => {
  expect(isBoolean('true')).toBe(false);
  expect(isBoolean(true)).toBe(true);
  expect(isBoolean(false)).toBe(true);
  expect(isBoolean()).toBe(false);
  expect(isBoolean(null)).toBe(false);
  expect(isBoolean(0)).toBe(false);
  expect(isBoolean('')).toBe(false);
  expect(isBoolean(new Boolean(true))).toBe(false);
  expect(isBoolean(new Boolean(true), 1)).toBe(true);
});

test('isDate function', () => {
  const date = new Date();
  const invalid = new Date('not a date');
  const now = Date.now();
  expect(isDate(date)).toBe(true);
  expect(isDate(now)).toBe(false);
  expect(isDate('2012-12-10')).toBe(false);
  expect(isDate(date.toISOString())).toBe(false);
  expect(isDate(0)).toBe(false);
  expect(isDate(Date)).toBe(false);
  expect(isDate(invalid)).toBe(true);
  expect(isDate(invalid, false)).toBe(false);
  expect(isDate(new Date(), 0)).toBe(true);
  expect(isDate(new Date('2021-12-23'), 0)).toBe(true);
  expect(isDate(new Date('2021-12-32'), 0)).toBe(false);
});

test('isDateLike function', () => {
  const date = new Date();
  const invalid = new Date('not a date');
  const now = Date.now();
  expect(isDateLike(date)).toBe(true);
  expect(isDateLike(now)).toBe(false);
  expect(isDateLike('2012-12-10')).toBe(true);
  expect(isDateLike(date.toISOString())).toBe(true);
  expect(isDateLike(0)).toBe(true);
  expect(isDateLike(6)).toBe(true);
  expect(isDateLike(13)).toBe(false);
  expect(isDateLike(Date)).toBe(false);
  expect(isDateLike('now')).toBe(false);
  expect(isDateLike(invalid)).toBe(false);
  expect(isDateLike(new Date())).toBe(true);
  expect(isDateLike(new Date('2021-12-23'))).toBe(true);
  expect(isDateLike(new Date('2021-12-32'))).toBe(false);
  expect(isDateLike('2021-12-23')).toBe(true);
  expect(isDateLike('2021-12-32')).toBe(false);
  expect(isDateLike([2021, 12, 10])).toBe(true);
});

test('isNumber function', () => {
  expect(isNumber('45')).toBe(false);
  expect(isNumber(45)).toBe(true);
  expect(isNumber(45n)).toBe(false);
  expect(isNumber(0b10010101101)).toBe(true);
  expect(isNumber(new Number(34))).toBe(false);
  expect(isNumber(new Number(34), true)).toBe(true);
});

test('isAnyNumber function', () => {
  expect(isAnyNumber('45')).toBe(false);
  expect(isAnyNumber(45)).toBe(true);
  expect(isAnyNumber(45n)).toBe(true);
  expect(isAnyNumber(0b10010101101)).toBe(true);
  expect(isAnyNumber(new Number(34))).toBe(true);
});

test('isNumberLike function', () => {
  expect(isNumberLike('45')).toBe(true);
  expect(isNumberLike(45)).toBe(true);
  expect(isNumberLike(45n)).toBe(true);
  expect(isNumberLike('45n')).toBe(false);
  expect(isNumberLike(0b10010101101)).toBe(true);
  expect(isNumberLike(new Number(34))).toBe(true);
  expect(isNumberLike('34%')).toBe(false);
  expect(isNumberLike('34e-5')).toBe(true);
  expect(isNumberLike('Infinity')).toBe(true);
  expect(isNumberLike(null)).toBe(false);
  expect(isNumberLike(undefined)).toBe(false);
  expect(isNumberLike(NaN)).toBe(true);
  expect(isNumberLike(true)).toBe(false);
  expect(isNumberLike(false)).toBe(false);
  expect(isNumberLike(new Boolean(true))).toBe(false);
});

test('isString function', () => {
  expect(isString('45')).toBe(true);
  expect(isString(45)).toBe(false);
  expect(isString(`this is a ${String('string')}`)).toBe(true);
  expect(isString('')).toBe(true);
  expect(isString()).toBe(false);
  expect(isString(new String('string object'))).toBe(false);
  expect(isString(new String('string object'), true)).toBe(true);
});
