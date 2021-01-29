export type ColorChannels = number[];

export type ColorSpaceMatrix = [
  ColorChannels,
  ColorChannels,
  ColorChannels,
];

export type Range = [number, number];

export type ColorValues = [number, number, number, number, number, number, number];

export interface RgbDescriptor {
  red: number | string;
  green: number | string;
  blue: number | string;
  alpha: number | string;
}

export interface HslDescriptor {
  hue: number | string;
  saturation: number | string;
  lightness: number | string;
  alpha: number | string;
}

export interface LabDescriptor {
  lightness: number | string;
  a: number | string;
  b: number | string;
  alpha: number | string;
}

export interface LchDescriptor {
  lightness: number | string;
  chroma: number | string;
  hue: number | string;
  alpha: number | string;
}

export interface XyzDescriptor {
  x: number | string;
  y: number | string;
  z: number | string;
  alpha: number | string;
  whitePoint?: number[];
}

export interface LabColorDescriptor extends LabDescriptor, LchDescriptor {}

export interface HwbDescriptor {
  hue: number | string;
  whiteness: number | string;
  blackness: number | string;
  alpha: number | string;
}

export interface ColorDescriptor extends RgbDescriptor, HslDescriptor {}

export const RGB_XYZ_MATRIX: ColorSpaceMatrix = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.072175],
  [0.0193339, 0.119192, 0.9503041],
];

export const XYZ_RGB_MATRIX: ColorSpaceMatrix = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.969266, 1.8760108, 0.041556],
  [0.0556434, -0.2040259, 1.0572252],
];

export const P3_XYZ_MATRIX: ColorSpaceMatrix = [
  [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
  [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
  [0, 0.04511338185890264, 1.043944368900976],
];

export const XYZ_P3_MATRIX: ColorSpaceMatrix = [
  [2.493496911941425, -0.9313836179191239, -0.40271078445071684],
  [-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
  [0.03584583024378447, -0.07617238926804182, 0.9568845240076872],
];

export const D65_D50_MATRIX: ColorSpaceMatrix = [
  [1.0478112, 0.0228866, -0.0501270],
  [0.0295424, 0.9904844, -0.0170491],
  [-0.0092345, 0.0150436, 0.7521316],
];

export const D50_D65_MATRIX: ColorSpaceMatrix = [
  [0.9555766, -0.0230393, 0.0631636],
  [-0.0282895, 1.0099416, 0.0210077],
  [0.0122982, -0.020483, 1.3299098],
];

export const D50: ColorChannels = [0.96422, 1, 0.82521];
export const D65: ColorChannels = [0.95047, 1, 1.08883];

export const OCT_RANGE: Range = [0, 255];
export const DEG_RANGE: Range = [0, 359];
export const ONE_RANGE: Range = [0, 1];
export const BYTE_RANGE: Range = [-127, 127];
export const CHROMA_RANGE: Range = [0, 260];

export const HEX_RE = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/;
export const HEX_RE_S = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/;
export const CMA_RE = /\(\s*([0-9a-z.%+-]+)\s*,\s*([0-9a-z.%+-]+)\s*,\s*([0-9a-z.%+-]+)\s*(?:,\s*([0-9a-z.%+-]+)\s*)?\)$/;
export const WSP_RE = /\(\s*([0-9a-z.%+-]+)\s+([0-9a-z.%+-]+)\s+([0-9a-z.%+-]+)\s*(?:\s+\/\s+([0-9a-z.%+-]+)\s*)?\)$/;
