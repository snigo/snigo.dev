/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import { round } from '@snigo.dev/mathx';
import {
  HEX_RE,
  HEX_RE_S,
  HslDescriptor,
  HwbDescriptor,
  LabDescriptor,
  LchDescriptor,
  RgbDescriptor,
} from './utils/constants';
import {
  defined,
  extractFnCommaGroups,
  extractFnWhitespaceGroups,
  extractGroups,
  hexToOctet,
} from './utils/utils';
import { AnyColorDescriptor } from './utils/model';
import sRGBColor from './classes/srgb.class';
import DisplayP3Color from './classes/display-p3.class';
import XYZColor from './classes/xyz.class';
import LabColor from './classes/lab.class';
import { namedColors, parseNamed } from './utils/named';

export type AnyColor = sRGBColor | LabColor | DisplayP3Color | XYZColor;
export type RgbProfile = 'srgb' | 'display-p3';

export function color(descriptor: string, rgbProfile?: RgbProfile): AnyColor | undefined;
export function color(
  descriptor: RgbDescriptor,
  rgbProfile?: RgbProfile,
): sRGBColor | DisplayP3Color | undefined;
export function color(
  descriptor: HslDescriptor,
  rgbProfile?: RgbProfile,
): sRGBColor | DisplayP3Color | undefined;
export function color(
  descriptor: HwbDescriptor,
  rgbProfile?: RgbProfile,
): sRGBColor | DisplayP3Color | undefined;
export function color(descriptor: LabDescriptor, rgbProfile?: RgbProfile): LabColor | undefined;
export function color(descriptor: LchDescriptor, rgbProfile?: RgbProfile): LabColor | undefined;
export function color(descriptor: AnyColor, rgbProfile?: RgbProfile): AnyColor;
export function color(
  descriptor: AnyColor | AnyColorDescriptor | string,
  rgbProfile?: RgbProfile
): AnyColor | undefined;
export function color(descriptor: any, rgbProfile = 'srgb'): AnyColor | undefined {
  if (typeof descriptor === 'object') {
    if (defined(descriptor.red, descriptor.green, descriptor.blue)) {
      return (rgbProfile === 'srgb' ? sRGBColor : DisplayP3Color).rgb(descriptor);
    }

    if (defined(descriptor.hue, descriptor.saturation, descriptor.lightness)) {
      return (rgbProfile === 'srgb' ? sRGBColor : DisplayP3Color).hsl(descriptor);
    }

    if (defined(descriptor.hue, descriptor.whiteness, descriptor.blackness)) {
      return (rgbProfile === 'srgb' ? sRGBColor : DisplayP3Color).hwb(descriptor);
    }

    if (defined(descriptor.x, descriptor.y, descriptor.z)) {
      return new XYZColor(descriptor);
    }

    if (defined(descriptor.lightness, descriptor.a, descriptor.b)) {
      return LabColor.lab(descriptor);
    }

    if (defined(descriptor.lightness, descriptor.chroma, descriptor.hue)) {
      return LabColor.lch(descriptor);
    }
  }

  if (typeof descriptor === 'string') {
    const d = descriptor.trim().toLowerCase();
    if (d.startsWith('p3:')) return color(d.substring(3), 'display-p3');

    if (namedColors.has(d)) {
      const [red, green, blue, hue, saturation, lightness, alpha] = parseNamed(d)
        || Array(7).fill(0);
      return new (rgbProfile === 'srgb' ? sRGBColor : DisplayP3Color)({
        red,
        green,
        blue,
        hue,
        saturation,
        lightness,
        alpha,
      });
    }

    if (d.startsWith('#')) {
      const re = d.length > 5 ? HEX_RE : HEX_RE_S;
      const rgba = extractGroups(re, d).map(hexToOctet);
      rgba[3] = round(rgba[3] / 255, 7);
      return (rgbProfile === 'srgb' ? sRGBColor : DisplayP3Color).rgbArray(rgba);
    }

    if (d.startsWith('rgb')) {
      return (rgbProfile === 'srgb' ? sRGBColor : DisplayP3Color)
        .rgbArray(d.includes(',')
          ? extractFnCommaGroups('rgb', d)
          : extractFnWhitespaceGroups('rgb', d));
    }

    if (d.startsWith('hsl')) {
      return (rgbProfile === 'srgb' ? sRGBColor : DisplayP3Color)
        .hslArray(d.includes(',')
          ? extractFnCommaGroups('hsl', d)
          : extractFnWhitespaceGroups('hsl', d));
    }

    if (d.startsWith('hwb')) {
      return (rgbProfile === 'srgb' ? sRGBColor : DisplayP3Color)
        .hwbArray(extractFnWhitespaceGroups('hwb', d));
    }

    if (d.startsWith('lab')) {
      return LabColor.labArray(extractFnWhitespaceGroups('lab', d));
    }

    if (d.startsWith('lch')) {
      return LabColor.lchArray(extractFnWhitespaceGroups('lch', d));
    }
  }

  return undefined;
}
