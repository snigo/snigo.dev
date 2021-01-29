import { random as rnd } from '@snigo.dev/mathx';
import DisplayP3Color from './classes/display-p3.class';
import LabColor from './classes/lab.class';
import sRGBColor from './classes/srgb.class';
import XYZColor from './classes/xyz.class';
import { AnyColor } from './color';
import {
  OCT_RANGE,
  DEG_RANGE,
  ONE_RANGE,
  BYTE_RANGE,
  CHROMA_RANGE,
  Range,
} from './utils/constants';
import { defined } from './utils/utils';

type RgbChannelRange = {
  red: Range;
  green: Range;
  blue: Range;
  alpha: number;
}

type HslChannelRange = {
  hue: Range;
  saturation: Range;
  lightness: Range;
  alpha: number;
}

type HwbChannelRange = {
  hue: Range;
  whiteness: Range;
  blackness: Range;
  alpha: number;
}

type LabChannelRange = {
  lightness: Range;
  a: Range;
  b: Range;
  alpha: number;
}

type LchChannelRange = {
  lightness: Range;
  chroma: Range;
  hue: Range;
  alpha: number;
}

type XyzChannelRange = {
  x: Range;
  y: Range;
  z: Range;
  alpha: number;
}

type AnyChannelRange = (
  RgbChannelRange
  | HslChannelRange
  | HwbChannelRange
  | LabChannelRange
  | LchChannelRange
  | XyzChannelRange
)

export interface ModelRanges {
  rgb: [typeof sRGBColor.rgb, RgbChannelRange, number[]];
  'p3:rgb': [typeof DisplayP3Color.rgb, RgbChannelRange, number[]];
  hsl: [typeof sRGBColor.hsl, HslChannelRange, number[]];
  'p3:hsl': [typeof DisplayP3Color.hsl, HslChannelRange, number[]];
  hwb: [typeof sRGBColor.hwb, HwbChannelRange, number[]];
  'p3:hwb': [typeof DisplayP3Color.hwb, HwbChannelRange, number[]];
  lab: [typeof LabColor.lab, LabChannelRange, number[]];
  lch: [typeof LabColor.lch, LchChannelRange, number[]];
  xyz: [typeof XYZColor.xyz, XyzChannelRange, number[]];
}

const MODEL_RANGES: ModelRanges = {
  rgb: [
    sRGBColor.rgb,
    {
      red: OCT_RANGE,
      green: OCT_RANGE,
      blue: OCT_RANGE,
      alpha: 1,
    },
    [0, 0, 0, 4],
  ],
  'p3:rgb': [
    DisplayP3Color.rgb,
    {
      red: OCT_RANGE,
      green: OCT_RANGE,
      blue: OCT_RANGE,
      alpha: 1,
    },
    [0, 0, 0, 4],
  ],
  hsl: [
    sRGBColor.hsl,
    {
      hue: DEG_RANGE,
      saturation: ONE_RANGE,
      lightness: ONE_RANGE,
      alpha: 1,
    },
    [0, 3, 3, 4],
  ],
  'p3:hsl': [
    DisplayP3Color.hsl,
    {
      hue: DEG_RANGE,
      saturation: ONE_RANGE,
      lightness: ONE_RANGE,
      alpha: 1,
    },
    [0, 3, 3, 4],
  ],
  hwb: [
    sRGBColor.hwb,
    {
      hue: DEG_RANGE,
      whiteness: ONE_RANGE,
      blackness: ONE_RANGE,
      alpha: 1,
    },
    [0, 3, 3, 4],
  ],
  'p3:hwb': [
    DisplayP3Color.hwb,
    {
      hue: DEG_RANGE,
      whiteness: ONE_RANGE,
      blackness: ONE_RANGE,
      alpha: 1,
    },
    [0, 3, 3, 4],
  ],
  lab: [
    LabColor.lab,
    {
      lightness: ONE_RANGE,
      a: BYTE_RANGE,
      b: BYTE_RANGE,
      alpha: 1,
    },
    [5, 3, 3, 4],
  ],
  lch: [
    LabColor.lch,
    {
      lightness: ONE_RANGE,
      chroma: CHROMA_RANGE,
      hue: DEG_RANGE,
      alpha: 1,
    },
    [5, 3, 3, 4],
  ],
  xyz: [
    XYZColor.xyz,
    {
      x: ONE_RANGE,
      y: ONE_RANGE,
      z: ONE_RANGE,
      alpha: 1,
    },
    [6, 6, 6, 4],
  ],
};

export function random(
  model: keyof ModelRanges = 'rgb',
  descriptor: Partial<AnyChannelRange> = {},
): AnyColor | undefined {
  if (typeof model !== 'string') return undefined;
  const _model = model.trim().toLowerCase() as keyof ModelRanges;

  const [f, p, presicion] = MODEL_RANGES[_model] || [];
  if (!f) return undefined;

  const props = { ...p };

  Object.keys(props).forEach((prop, i) => {
    if (defined((descriptor as any)[prop])) {
      (props as any)[prop] = (descriptor as any)[prop];
    }
    if (Array.isArray((props as any)[prop])) {
      (props as any)[prop] = rnd((props as any)[prop], presicion[i]);
    }
  });
  return f((props as any));
}
