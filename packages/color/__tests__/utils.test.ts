// @ts-nocheck
/* eslint-disable no-new-wrappers */
import {
  applyMatrix,
  assumeAlpha,
  assumeByte,
  assumeChroma,
  assumeHue,
  assumeOctet,
  assumePercent,
  clamp,
  defined,
  equal,
  extractFnCommaGroups,
  extractFnWhitespaceGroups,
  extractGroups,
  fromFraction,
  getFraction,
  getHslSaturation,
  hexToOctet,
  octetToHex,
} from '../src/utils/utils';
import { instanceOfColor } from '../src/utils/model';
import {
  color,
  sRGBColor,
  LabColor,
  XYZColor,
} from '../src';

test('applyMatrix helper function', () => {
  const xyz = [1, 2, 3];
  const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  expect(applyMatrix(xyz, matrix)).toEqual([14, 32, 50]);
  expect(applyMatrix(xyz, [])).toEqual([1, 2, 3]);
  expect(applyMatrix(xyz)).toEqual([1, 2, 3]);
  expect(applyMatrix([], matrix)).toBeUndefined();
  expect(applyMatrix(null, matrix)).toBeUndefined();
  expect(applyMatrix()).toBeUndefined();
});

test('assumeAlpha function should convert alpha value to corresponding numeric', () => {
  expect(assumeAlpha('40%')).toBe(0.4);
  expect(assumeAlpha('3.145317%')).toBe(0.0315);
  expect(assumeAlpha('0.361')).toBe(0.361);
  expect(assumeAlpha('.45')).toBe(0.45);
  expect(assumeAlpha('-.25')).toBe(0);
  expect(assumeAlpha('34e-2')).toBe(0.34);
  expect(assumeAlpha(0.42)).toBe(0.42);
  expect(assumeAlpha(4.2)).toBe(1);
});

test('assumeByte function should convert byte value [-127...127] to corresponding numeric', () => {
  expect(assumeByte('0x0f')).toBe(15);
  expect(assumeByte('-37')).toBe(-37);
  expect(assumeByte('0.361432353365865785673567547')).toBe(0.361);
  expect(assumeByte('3.4e2')).toBe(127);
  expect(assumeByte(42)).toBe(42);
  expect(assumeByte(-214.2)).toBe(-127);
  expect(assumeByte('34%')).toBeNaN();
});

test('assumeChroma function should convert chroma value [0...260] to corresponding numeric', () => {
  expect(assumeChroma('0x5f')).toBe(95);
  expect(assumeChroma('-3')).toBe(0);
  expect(assumeChroma('103.361432353365865785673567547')).toBe(103.361);
  expect(assumeChroma('3.4e2')).toBe(260);
  expect(assumeChroma(42)).toBe(42);
  expect(assumeChroma(-214.2)).toBe(0);
  expect(assumeChroma('34%')).toBeNaN();
});

test('assumeHue function should convert CSS approved angle units to numeric degrees', () => {
  expect(assumeHue('240deg')).toBe(240);
  expect(assumeHue('360')).toBe(0);
  expect(assumeHue('361deg')).toBe(1);
  expect(assumeHue('.45turn')).toBe(162);
  expect(assumeHue('-.25turn')).toBe(270);
  expect(assumeHue('.25turns')).toBeNaN();
  expect(assumeHue('200grad')).toBe(180);
  expect(assumeHue('0.25grad')).toBe(0.225);
  expect(assumeHue('0.25rad')).toBe(14.324);
  expect(assumeHue('.25RAD')).toBe(14.324);
  expect(assumeHue('3.14rad')).toBe(179.909);
  expect(assumeHue('-3.14rad')).toBe(180.091);
  expect(assumeHue(90)).toBe(90);
});

test('assumeOctet function should convert octet value [0 ... 255] to corresponding numeric', () => {
  expect(assumeOctet('40%')).toBe(102);
  expect(assumeOctet('3.1457%')).toBe(8);
  expect(assumeOctet('361')).toBe(255);
  expect(assumeOctet('-.45')).toBe(0);
  expect(assumeOctet('3.4e1')).toBe(34);
  expect(assumeOctet(42)).toBe(42);
  expect(assumeOctet(4.2)).toBe(4);
});

test('assumePercent function should convert percentage value to corresponding numeric', () => {
  expect(assumePercent('40%')).toBe(0.4);
  expect(assumePercent('3.145317%')).toBe(0.0314532);
  expect(assumePercent('0.361')).toBeNaN();
  expect(assumePercent('.45')).toBeNaN();
  expect(assumePercent('3.4e1%')).toBe(0.34);
  expect(assumePercent(0.42)).toBe(0.42);
  expect(assumePercent(4.2)).toBe(1);
});

test('clamp helper function', () => {
  const range = [0, 9];

  expect(clamp(range, -1)).toBe(0);
  expect(clamp(range, 10)).toBe(9);
  expect(clamp(range, 4)).toBe(4);
  expect(clamp()).toBeNaN();
  expect(clamp(range, '+3.45e-1')).toBe(0.345);
  expect(clamp(undefined, 100)).toBe(100);
});

test('defined function should indicate whether all arguments are defined - not Nil and not NaN', () => {
  expect(defined(0, '', false)).toBe(true);
  expect(defined(255, {}, [])).toBe(true);
  expect(defined(255, NaN, 255)).toBe(false);
  expect(defined(undefined)).toBe(false);
  expect(defined(null)).toBe(false);
});

test('equal function should shallow compare two arrays', () => {
  const A = [1, 2, 3];
  const B = [1, 2, 3];
  const C = [1, 2, 4];
  const D = A;

  expect(equal(A, B)).toBe(true);
  expect(equal(A, D)).toBe(true);
  expect(equal(A, C)).toBe(false);
  expect(equal([], [])).toBe(true);
  expect(equal([A, B], [A, D])).toBe(false);
});

test('extractFnCommaGroups function extracts groups with provided string and regex pattern', () => {
  const clr = 'hsL(  314deg , 45% , 100% , .4  )';
  expect(extractFnCommaGroups('hsl', clr)).toEqual(['314deg', '45%', '100%', '.4']);
  expect(extractFnCommaGroups('rgb', clr)).toEqual([]);
});

test('extractFnWhitespaceGroups function extracts groups with provided string and regex pattern', () => {
  const clr = 'HsL(  314deg   45%   100%   /   .4  )';
  expect(extractFnWhitespaceGroups('hsl', clr)).toEqual(['314deg', '45%', '100%', '.4']);
  expect(extractFnWhitespaceGroups('lab', clr)).toEqual([]);
});

test('extractGroups function extracts groups with provided string and regex pattern', () => {
  const str = 'Can you extract me?';
  const re = /^.+(ex\w+)\s(.+)\?$/;
  expect(extractGroups(re, str)).toEqual(['extract', 'me']);
  expect(extractGroups(re, 'Hello World')).toEqual([]);
});

test('getFraction and fromFraction function', () => {
  const range = [-100, 100];

  expect(getFraction(range, 0)).toBe(0.5);
  expect(fromFraction(range, 0.5)).toBe(0);
  expect(getFraction(range, 50)).toBe(0.75);
  expect(fromFraction(range, 0.75)).toBe(50);
  expect(getFraction(range, 200)).toBe(1.5);
  expect(fromFraction(range, 1.5)).toBe(200);
  expect(fromFraction(range, -0.5)).toBe(-200);
  expect(getFraction()).toBeNaN();
  expect(fromFraction()).toBeNaN();
  expect(getFraction(range, Infinity)).toBe(Infinity);
  expect(fromFraction(range, Infinity)).toBe(Infinity);
});

test('getHslSaturation function should calculate saturation based on chroma and saturation values', () => {
  expect(getHslSaturation(0.45, 0.5)).toBe(0.45);
  expect(getHslSaturation('0.45', '0.5')).toBe(0.45);
  expect(getHslSaturation(0.05, 0.6)).toBe(0.0625);
  expect(getHslSaturation(0.1, 0.3)).toBe(0.16667);
  expect(getHslSaturation(0, 0)).toBe(0);
  expect(getHslSaturation(1, 1)).toBe(1);
  expect(getHslSaturation(1, 'not a number')).toBeNaN();
  expect(getHslSaturation()).toBeNaN();
});

test('hexToOctet and octetToHex function should convert hexadecimal and decimal octets', () => {
  expect(hexToOctet('ff')).toBe(255);
  expect(octetToHex('255')).toBe('ff');
  expect(hexToOctet('f')).toBe(255);
  expect(octetToHex(255)).toBe('ff');
  expect(hexToOctet('fff')).toBe(255);
  expect(octetToHex(265)).toBe('ff');
  expect(hexToOctet('0f1')).toBe(15);
  expect(octetToHex(15)).toBe('0f');
  expect(hexToOctet('3')).toBe(51);
  expect(octetToHex(51)).toBe('33');
  expect(hexToOctet('')).toBeNaN();
  expect(octetToHex()).toBe('NaN');
});

test('instanceOfColor function shall detect instances of color', () => {
  const srgbColor = color('rgb(255 255 0)');
  const labColor = color('lch(80% 102 34deg)');
  const xyzColor = new XYZColor({
    x: 0.34,
    y: 0.23,
    z: 1,
    whitePoint: XYZColor.D65,
  });

  expect(instanceOfColor(srgbColor)).toBe(true);
  expect(instanceOfColor(labColor)).toBe(true);
  expect(instanceOfColor(xyzColor)).toBe(true);
  expect(srgbColor).toBeInstanceOf(sRGBColor);
  expect(labColor).toBeInstanceOf(LabColor);
  expect(xyzColor).toBeInstanceOf(XYZColor);
  expect(instanceOfColor({ hue: 360, saturation: 0.75, lightness: 0.5 })).toBe(false);
  expect(instanceOfColor('red')).toBe(false);
});
