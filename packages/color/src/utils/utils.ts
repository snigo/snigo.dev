import { num, mod, round } from '@snigo.dev/mathx';
import {
  BYTE_RANGE,
  CHROMA_RANGE,
  ONE_RANGE,
  OCT_RANGE,
  WSP_RE,
  CMA_RE,
  ColorChannels,
  ColorSpaceMatrix,
  Range,
} from './constants';

export const applyMatrix = (
  xyz: ColorChannels,
  matrix: ColorSpaceMatrix,
): ColorChannels | undefined => {
  if (!xyz || !(Array.isArray(xyz) && xyz.length)) return undefined;
  if (!matrix || !(Array.isArray(matrix) && xyz.length === matrix.length)) return xyz;
  return xyz
    .map((_, i, _xyz) => _xyz.reduce((p, v, j) => p + v * matrix[i][j], 0));
};

export const clamp = (range: Range, value: string | number): number => {
  const v = +value;
  if (v == null || Number.isNaN(v)) return NaN;
  if (!Array.isArray(range)) return v;

  if (v < range[0]) return range[0];
  if (v > range[1]) return range[1];
  return v;
};

// eslint-disable-next-line eqeqeq
export const defined = (...args: any[]) => args.every((arg) => arg || (!arg && arg == 0));

export const fromFraction = (range: Range, value: string | number): number => {
  if (!Array.isArray(range)) return NaN;
  return range[0] + +value * (range[1] - range[0]);
};

export const assumeAlpha = (value: string | number): number => (
  defined(value) ? clamp(ONE_RANGE, num(value, 4)) : 1
);

export const assumeByte = (value: string | number): number => (
  clamp(BYTE_RANGE, round(+value, 3))
);

export const assumeChroma = (value: string | number): number => (
  clamp(CHROMA_RANGE, round(+value, 3))
);

export const assumeHue = (value: string | number): number => {
  if (typeof value === 'number') return round(mod(value, 360), 3);
  if (typeof value !== 'string') return NaN;
  const v = value.trim().toLowerCase();

  const hue = v.match(/^([+\-0-9e.]+)(turn|g?rad|deg)?$/);
  if (!hue) return NaN;
  let h = +hue[1];
  hue[2] = hue[2] || 'deg';
  switch (hue[2]) {
    case 'turn':
      h *= 360;
      break;
    case 'rad':
      h *= (180 / Math.PI);
      break;
    case 'grad':
      h *= 0.9;
      break;
    case 'deg':
      break;
    default:
      return NaN;
  }

  return round(mod(h, 360), 3);
};

export const assumePercent = (value: string | number): number => {
  if (typeof value === 'number') return clamp(ONE_RANGE, round(value, 5));
  if (typeof value !== 'string' || !/%$/.test(value)) return NaN;
  return clamp(ONE_RANGE, num(value, 7));
};

export const assumeOctet = (value: string | number): number => {
  if (typeof value === 'number') return clamp(OCT_RANGE, round(value, 0));
  if (typeof value !== 'string') return NaN;
  return clamp(OCT_RANGE, /%$/.test(value) ? round(fromFraction(OCT_RANGE, num(value)), 0) : round(+value, 0));
};

export const equal = (a: any[], b: any[]): boolean => a.every((e, i) => b[i] === e);

export const extractGroups = (re: RegExp, str: string): string[] => (
  (re.exec(str.toLowerCase()) || []).filter((value, index) => index && !!value)
);

export const extractFnCommaGroups = (fn: string, str: string): string[] => {
  const fnString = (fn === 'rgb' || fn === 'hsl') ? `${fn}a?` : fn;
  const re = new RegExp(`^${fnString}${CMA_RE.source}`);
  return extractGroups(re, str);
};

export const extractFnWhitespaceGroups = (fn: string, str: string): string[] => {
  const fnString = (fn === 'rgb' || fn === 'hsl') ? `${fn}a?` : fn;
  const re = new RegExp(`^${fnString}${WSP_RE.source}`);
  return extractGroups(re, str);
};

export const getFraction = (range: Range, value: string | number): number => {
  if (!Array.isArray(range)) return NaN;
  return (+value - range[0]) / (range[1] - range[0]);
};

export const getHslSaturation = (chroma: number, lightness: number): number => {
  let saturation;

  if (lightness > 0 && lightness <= 0.5) {
    saturation = chroma / (2 * lightness);
  } else {
    saturation = chroma / ((2 - 2 * lightness) || lightness);
  }
  return assumePercent(saturation);
};

export const hexToOctet = (hex: string): number => (
  parseInt(hex.length === 1 ? hex.repeat(2) : hex.substring(0, 2), 16)
);

export const octetToHex = (octet: string | number): string => (
  clamp(OCT_RANGE, +octet).toString(16).padStart(2, '0')
);

export const getHueDiff = (from: number, to: number, dir: number): number => {
  const ccw = -(mod(from - to, 360) || 360);
  const cw = mod(to - from, 360) || 360;
  switch (dir) {
    case -1:
      return ccw;
    case 1:
      return cw;
    case 0:
    default:
      return ((cw % 360 <= 180) ? cw : ccw);
  }
};
