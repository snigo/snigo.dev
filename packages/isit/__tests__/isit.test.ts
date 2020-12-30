/* eslint-disable symbol-description */
// @ts-nocheck
/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
/* eslint-disable no-new-func */
/* eslint-disable func-names */
import {
  isArrow,
  isConstructor,
  isFunction,
  isIterable,
  isNullish,
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

test('isSymbol function', () => {
  expect(isSymbol(Symbol)).toBe(false);
  expect(isSymbol(Symbol())).toBe(true);
  expect(isSymbol()).toBe(false);
  expect(isSymbol(Symbol('not a symbol'))).toBe(true);
});
