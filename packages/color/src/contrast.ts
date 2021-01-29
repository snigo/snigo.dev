/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import { round, approx } from '@snigo.dev/mathx';
import sRGBColor from './classes/srgb.class';
import LabColor from './classes/lab.class';
import XYZColor from './classes/xyz.class';
import DisplayP3Color from './classes/display-p3.class';
import { AnyColor, color } from './color';
import { mix } from './mix';
import {
  AnyColorDescriptor,
  applyModel,
  instanceOfColor,
  MODEL_PARAMS,
} from './utils/model';

export interface ContractFindDescriptor {
  targetContrast?: number;
  hue: number | string;
  saturation?: number | string;
  chroma?: number | string;
  model?: keyof typeof MODEL_PARAMS;
}

export interface ColorValidationResponse {
  'wcag-aa-normal-text': boolean;
  'wcag-aa-large-text': boolean;
  'wcag-aa-ui': boolean;
  'wcag-aaa-normal-text': boolean;
  'wcag-aaa-large-text': boolean;
}

export interface ContractFunctionWithBase {
  (compareColor: AnyColor | AnyColorDescriptor | string, precision?: number): number;
  find: (descriptor: ContractFindDescriptor) => AnyColor[];
  min: (colors: (AnyColor | AnyColorDescriptor | string)[]) => AnyColor | undefined;
  max: (colors: (AnyColor | AnyColorDescriptor | string)[]) => AnyColor | undefined;
  closest: (
    target: number,
    colors: (AnyColor | AnyColorDescriptor | string)[]
  ) => AnyColor | undefined;
  validate: (col: AnyColor | AnyColorDescriptor | string) => ColorValidationResponse | undefined;
}

type NonXyzColor = Exclude<AnyColor, XYZColor>;

export function contrast(
  base: AnyColor | AnyColorDescriptor | string,
  compareColor: AnyColor | AnyColorDescriptor | string,
  precision?: number,
): number | undefined;
export function contrast(
  base: AnyColor | AnyColorDescriptor | string,
): ContractFunctionWithBase | undefined;
export function contrast(base: any = '#fff', compareColor?: any, precision: any = 2) {
  const _base = instanceOfColor(base) ? (base as unknown as AnyColor) : color(base);
  if (!_base) return undefined;
  if (_base.alpha !== 1) throw SyntaxError('Base color cannot be semitransparent.');

  if (arguments.length < 2) {
    const contractFunctionWithBase = (
      cc: AnyColor | AnyColorDescriptor | string,
      p = 2,
    ) => contrast(_base, cc, p);
    contractFunctionWithBase.find = (
      d: ContractFindDescriptor,
    ) => contrast.find(_base, d);
    contractFunctionWithBase.min = (
      colors: (AnyColor | AnyColorDescriptor | string)[],
    ) => contrast.min(_base, colors);
    contractFunctionWithBase.max = (
      colors: (AnyColor | AnyColorDescriptor | string)[],
    ) => contrast.max(_base, colors);
    contractFunctionWithBase.closest = (
      target: number,
      colors: (AnyColor | AnyColorDescriptor | string)[],
    ) => contrast.closest(_base, target, colors);
    contractFunctionWithBase.validate = (
      col: AnyColor | AnyColorDescriptor | string,
    ) => contrast.validate(_base, col);
    return contractFunctionWithBase as ContractFunctionWithBase;
  }

  let _c = instanceOfColor(compareColor) ? (compareColor as AnyColor) : color(compareColor);
  if (_c == null) return undefined;
  if (_c.alpha < 1) {
    let model: keyof typeof MODEL_PARAMS;
    if (_c instanceof sRGBColor) {
      model = 'rgb';
    } else if (_c instanceof DisplayP3Color) {
      model = 'p3:rgb';
    } else if (_c instanceof LabColor) {
      model = 'lab';
    } else if (_c instanceof XYZColor) {
      model = 'xyz';
    } else {
      return undefined;
    }
    _c = mix(model, { start: _base, end: _c });
    if (_c == null) return undefined;
  }
  const dark = Math.min(_c.luminance, _base.luminance);
  const light = Math.max(_c.luminance, _base.luminance);

  return round((light + 0.05) / (dark + 0.05), precision);
}

contrast.closest = (
  base: AnyColor | AnyColorDescriptor | string,
  targetContrast: number,
  colorArray: (AnyColor | AnyColorDescriptor | string)[],
): AnyColor | undefined => {
  const _base = instanceOfColor(base) ? base : color(base);
  if (!_base) return undefined;

  let output: AnyColor | undefined;
  let diff = 22;

  colorArray.forEach((c) => {
    const cv = contrast(_base, c);
    if (cv != null) {
      const _d = Math.abs(cv - targetContrast) || 100;
      if (_d < diff) {
        output = color(c);
        diff = _d;
      }
    }
  });

  return output;
};

contrast.min = (
  base: AnyColor | AnyColorDescriptor | string,
  colorArray: (AnyColor | AnyColorDescriptor | string)[],
): AnyColor | undefined => {
  const _base = instanceOfColor(base) ? base : color(base);
  if (!_base) return undefined;

  let output: AnyColor | undefined;
  let min = 22;

  colorArray.forEach((c) => {
    const _c = color(c);
    if (_c == null) return undefined;
    const cv = contrast(_base, _c);
    if (cv == null) return undefined;
    if (cv < min) {
      output = _c;
      min = cv;
    }
    return undefined;
  });

  return output;
};

contrast.max = (
  base: AnyColor | AnyColorDescriptor | string,
  colorArray: (AnyColor | AnyColorDescriptor | string)[],
): AnyColor | undefined => {
  const _base = instanceOfColor(base) ? base : color(base);
  if (!_base) return undefined;

  let output: AnyColor | undefined;
  let max = 0;

  colorArray.forEach((c) => {
    const _c = color(c);
    if (_c == null) return undefined;
    const cv = contrast(_base, _c);
    if (cv == null) return undefined;
    if (cv > max) {
      output = _c;
      max = cv;
    }
    return undefined;
  });

  return output;
};

contrast.validate = (
  base: AnyColor | AnyColorDescriptor | string,
  col: AnyColor | AnyColorDescriptor | string,
): ColorValidationResponse | undefined => {
  const cv = contrast(base, col, 7);
  if (cv == null) return undefined;
  const _contrast = Math.floor(cv * 100) / 100;
  return {
    'wcag-aa-normal-text': _contrast >= 4.5,
    'wcag-aa-large-text': _contrast >= 3,
    'wcag-aa-ui': _contrast >= 3,
    'wcag-aaa-normal-text': _contrast >= 7,
    'wcag-aaa-large-text': _contrast >= 4.5,
  };
};

contrast.find = (
  base: AnyColor | AnyColorDescriptor | string,
  {
    targetContrast = 7,
    hue,
    saturation = 1,
    chroma = 100,
    model = 'hsl',
  }: ContractFindDescriptor,
): (
  LabColor
  | sRGBColor
  | DisplayP3Color
)[] | undefined => {
  let m = model.trim().toLowerCase() as keyof typeof MODEL_PARAMS;
  if (m === 'xyz' || m === 'rgb') m = 'hsl';
  if (m === 'p3:rgb') m = 'p3:hsl';
  if (m === 'lab') m = 'lch';

  const _base = applyModel(model, base);
  if (!_base) return undefined;

  const output: number[] = [];
  const yb = _base.luminance;
  const y0 = targetContrast * (yb + 0.05) - 0.05;
  const y1 = (yb + 0.05) / targetContrast - 0.05;
  if (y0 >= 0 && y0 <= 1) output.push(y0);
  if (y1 >= 0 && y1 <= 1) output.push(y1);

  if (!output.length) return [];

  const [ColorConstructor] = MODEL_PARAMS[m];
  if (m.startsWith('p3:')) m = m.substring(3)as keyof typeof MODEL_PARAMS;

  return output.map((y) => {
    const DELTA = 0.0025;
    const MAX_ITERATION_COUNT = 7;

    let minL = 0;
    let maxL = 1;

    let c: NonXyzColor | undefined;
    let i = 0;

    while (i <= MAX_ITERATION_COUNT) {
      c = (ColorConstructor as any)[model]({
        hue,
        saturation,
        chroma,
        lightness: (maxL + minL) / 2,
      }) as NonXyzColor;

      const yc = c.luminance;

      if (approx(yc, y, DELTA) || i === MAX_ITERATION_COUNT) {
        let f;
        if ((yc > y && y > yb) || (yc < y && y < yb)) {
          f = 0;
        } else if (yc > y && y < yb) {
          f = -1;
        } else {
          f = 1;
        }
        return f
          ? c.copyWith({ lightness: c.lightness + f * 0.004, hue }) as NonXyzColor
          : c;
      }

      if (yc > y) {
        maxL = (maxL + minL) / 2;
      } else {
        minL = (maxL + minL) / 2;
      }

      i += 1;
    }

    return c;
  }) as NonXyzColor[];
};
