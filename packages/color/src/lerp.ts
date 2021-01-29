/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import XYZColor from './classes/xyz.class';
import { AnyColor } from './color';
import { XyzDescriptor } from './utils/constants';
import { AnyColorDescriptor, applyModel, MODEL_PARAMS } from './utils/model';
import { getHueDiff } from './utils/utils';

type NonXyzColor = Exclude<AnyColor, XYZColor>;
type NonXyzColorDescriptor = Exclude<AnyColorDescriptor, XyzDescriptor>;

export interface LerpDescriptor {
  start: NonXyzColor | NonXyzColorDescriptor | string;
  end: NonXyzColor | NonXyzColorDescriptor | string;
  stops?: number;
  hueDirection?: number;
  includeLast?: boolean;
}

export function lerp(
  model: keyof typeof MODEL_PARAMS,
  descriptor: LerpDescriptor
): NonXyzColor[] | undefined;
export function lerp(
  model: keyof typeof MODEL_PARAMS
): (descriptor: LerpDescriptor) => NonXyzColor[] | undefined;
export function lerp(model: keyof typeof MODEL_PARAMS = 'rgb', descriptor?: any) {
  if (typeof model !== 'string') return undefined;
  if (!descriptor) return (d: LerpDescriptor) => lerp(model, d);

  const {
    start,
    end,
    stops = 1,
    hueDirection = 0,
    includeLast = true,
  }: LerpDescriptor = descriptor;

  let m = (model.trim().toLowerCase() as keyof typeof MODEL_PARAMS);
  const _start = (applyModel(m, start) as NonXyzColor);
  const _end = (applyModel(m, end) as NonXyzColor);
  if (!_start || !_end) return undefined;

  const output = [_start];
  let _stops = Math.trunc(stops);
  if (!_stops || _stops < 0) return includeLast ? output.concat(_end) : output;
  if (_stops > 255) _stops = 255;

  const [ColorConstructor, params] = MODEL_PARAMS[m];
  if (ColorConstructor === XYZColor) return undefined;
  if (m.startsWith('p3:')) m = (m.substring(3) as keyof typeof MODEL_PARAMS);

  /** anyfying JS magic, trust the system */
  const deltas = (params as any).map((p: string) => p === 'hue'
    ? getHueDiff(_start.hue, _end.hue, hueDirection) / (_stops + 1)
    : ((_end as any)[p] - (_start as any)[p]) / (_stops + 1));

  while (_stops > 0) {
    output.push((ColorConstructor as any)[`${model}Array`]((params as any).map((p: string, i: number) => (_start as any)[p] + deltas[i] * output.length)));
    _stops -= 1;
  }

  return includeLast ? output.concat(_end) : output;
}
