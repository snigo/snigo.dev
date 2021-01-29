/* eslint-disable import/no-cycle */
import { round } from '@snigo.dev/mathx';
import LabColor from './lab.class';
import sRGBColor from './srgb.class';
import DisplayP3Color from './display-p3.class';
import {
  applyMatrix,
  assumeAlpha,
  equal,
} from '../utils/utils';
import {
  D50,
  D50_D65_MATRIX,
  D65,
  D65_D50_MATRIX,
  XYZ_P3_MATRIX,
  XYZ_RGB_MATRIX,
  XyzDescriptor,
} from '../utils/constants';

class XYZColor {
  readonly x: number = 0;

  readonly y: number = 0;

  readonly z: number = 0;

  readonly alpha: number = 0;

  readonly whitePoint: number[] = D50;

  readonly profile: string = 'cie-xyz';

  constructor({
    x,
    y,
    z,
    alpha = 1,
    whitePoint = XYZColor.D50,
  }: XyzDescriptor) {
    Object.defineProperties(this, {
      x: {
        value: round(+x, 6),
        enumerable: true,
        configurable: false,
        writable: false,
      },
      y: {
        value: round(+y, 6),
        enumerable: true,
        configurable: false,
        writable: false,
      },
      z: {
        value: round(+z, 6),
        enumerable: true,
        configurable: false,
        writable: false,
      },
      alpha: {
        value: assumeAlpha(alpha),
      },
      whitePoint: {
        value: whitePoint,
      },
      profile: {
        value: 'cie-xyz',
      },
    });
  }

  static get D50() {
    return D50;
  }

  static get D65() {
    return D65;
  }

  static xyz({
    x,
    y,
    z,
    alpha,
    whitePoint,
  }: XyzDescriptor) {
    return new XYZColor({
      x,
      y,
      z,
      alpha,
      whitePoint,
    });
  }

  static xyzArray([x, y, z, alpha]: string[] | number[]) {
    return XYZColor.xyz({
      x,
      y,
      z,
      alpha,
    });
  }

  get luminance() {
    return this.y;
  }

  get mode() {
    return +(this.luminance < 0.18);
  }

  adapt(whitePoint: number[]) {
    if (equal(whitePoint, this.whitePoint)) return this;
    const [x, y, z] = applyMatrix(
      this.toXyzArray(),
      equal(whitePoint, XYZColor.D50) ? D65_D50_MATRIX : D50_D65_MATRIX,
    ) || [0, 0, 0];
    return new XYZColor({
      x,
      y,
      z,
      alpha: this.alpha,
      whitePoint,
    });
  }

  toXyzArray() {
    return [this.x, this.y, this.z];
  }

  toLab() {
    const xyz = (equal(this.whitePoint, XYZColor.D65)
      ? this.adapt(XYZColor.D50)
      : this).toXyzArray();

    const e = 0.008856;
    const k = 903.3;
    const [fx, fy, fz] = xyz
      .map((V, i) => V / D50[i])
      .map((vr) => vr > e ? Math.cbrt(vr) : (k * vr + 16) / 116);

    return LabColor.lab({
      lightness: (116 * fy - 16) / 100,
      a: 500 * (fx - fy),
      b: 200 * (fy - fz),
      alpha: this.alpha,
    }) as LabColor;
  }

  toRgb() {
    const xyz = (equal(this.whitePoint, XYZColor.D65)
      ? this
      : this.adapt(XYZColor.D65)).toXyzArray();

    return sRGBColor.linArray(
      (applyMatrix(xyz, XYZ_RGB_MATRIX) || [0, 0, 0]).concat(this.alpha),
    ) as sRGBColor;
  }

  toP3() {
    const xyz = (equal(this.whitePoint, XYZColor.D65)
      ? this
      : this.adapt(XYZColor.D65)).toXyzArray();

    return DisplayP3Color.linArray(
      (applyMatrix(xyz, XYZ_P3_MATRIX) || [0, 0, 0]).concat(this.alpha),
    ) as DisplayP3Color;
  }

  toXyz() {
    return this;
  }
}

export default XYZColor;
