/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import { color, AnyColor } from '../color';
import LabColor from '../classes/lab.class';
import DisplayP3Color from '../classes/display-p3.class';
import sRGBColor from '../classes/srgb.class';
import XYZColor from '../classes/xyz.class';
import {
  HslDescriptor,
  HwbDescriptor,
  LabDescriptor,
  LchDescriptor,
  RgbDescriptor,
  XyzDescriptor,
} from './constants';

export interface ColorModelParams {
  rgb: [typeof sRGBColor, (keyof RgbDescriptor)[]],
  hsl: [typeof sRGBColor, (keyof HslDescriptor)[]],
  lab: [typeof LabColor, (keyof LabDescriptor)[]],
  lch: [typeof LabColor, (keyof LchDescriptor)[]],
  xyz: [typeof XYZColor, (keyof XyzDescriptor)[]],
  'p3:rgb': [typeof DisplayP3Color, (keyof RgbDescriptor)[]],
  'p3:hsl': [typeof DisplayP3Color, (keyof HslDescriptor)[]],
}

export const MODEL_PARAMS: ColorModelParams = {
  rgb: [sRGBColor, ['red', 'green', 'blue', 'alpha']],
  hsl: [sRGBColor, ['hue', 'saturation', 'lightness', 'alpha']],
  lab: [LabColor, ['lightness', 'a', 'b', 'alpha']],
  lch: [LabColor, ['lightness', 'chroma', 'hue', 'alpha']],
  xyz: [XYZColor, ['x', 'y', 'z', 'alpha']],
  'p3:rgb': [DisplayP3Color, ['red', 'green', 'blue', 'alpha']],
  'p3:hsl': [DisplayP3Color, ['hue', 'saturation', 'lightness', 'alpha']],
};

export function instanceOfColor(c: any): boolean {
  return c instanceof sRGBColor
    || c instanceof DisplayP3Color
    || c instanceof LabColor
    || c instanceof XYZColor;
}

export type AnyColorDescriptor = RgbDescriptor
  | HslDescriptor
  | HwbDescriptor
  | LabDescriptor
  | LchDescriptor;

export function applyModel(
  model: keyof typeof MODEL_PARAMS,
  c?: string,
): AnyColor | undefined;
export function applyModel(
  model: keyof typeof MODEL_PARAMS,
  c?: AnyColorDescriptor,
): AnyColor | undefined;
export function applyModel(
  model: keyof typeof MODEL_PARAMS,
  c?: AnyColor,
): AnyColor;
export function applyModel(
  model: keyof typeof MODEL_PARAMS,
  c?: AnyColor | AnyColorDescriptor | string,
): AnyColor;
export function applyModel(model: keyof typeof MODEL_PARAMS, c: any): AnyColor | undefined {
  if (c == null) return undefined;
  switch (model) {
    case 'rgb':
    case 'hsl':
      return instanceOfColor(c)
        ? (c as AnyColor).toRgb()
        : applyModel(model, color(c));
    case 'lab':
    case 'lch':
      return instanceOfColor(c)
        ? (c as AnyColor).toLab()
        : applyModel(model, color(c));
    case 'xyz':
      return instanceOfColor(c)
        ? (c as AnyColor).toXyz()
        : applyModel(model, color(c));
    case 'p3:rgb':
    case 'p3:hsl':
      return instanceOfColor(c)
        ? (c as AnyColor).toP3()
        : applyModel(model, color(c));
    default:
      return undefined;
  }
}
