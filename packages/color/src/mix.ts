/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import { AnyColor } from './color';
import { AnyColorDescriptor, applyModel, MODEL_PARAMS } from './utils/model';
import { assumePercent, getHueDiff } from './utils/utils';

export interface MixDescriptor {
  start: AnyColor | AnyColorDescriptor | string;
  end: AnyColor | AnyColorDescriptor | string;
  alpha?: string | number;
  hueDirection?: number;
}

export function mix(
  model: keyof typeof MODEL_PARAMS,
  descriptor: MixDescriptor
): AnyColor | undefined;
export function mix(
  model: keyof typeof MODEL_PARAMS
): (descriptor: MixDescriptor) => AnyColor | undefined;
export function mix(model: keyof typeof MODEL_PARAMS = 'rgb', descriptor?: any) {
  if (typeof model !== 'string') return undefined;
  if (!descriptor) return (d: MixDescriptor) => mix(model, d);

  const {
    start,
    end,
    alpha = 1,
    hueDirection = 0,
  }: MixDescriptor = descriptor;

  let m = (model.trim().toLowerCase() as keyof typeof MODEL_PARAMS);
  const _start = applyModel(m, start);
  const _end = applyModel(m, end);
  if (!_start && !_end) return undefined;
  if (!_start) return _end;
  if (!_end) return _start;

  const factor = _end.alpha * assumePercent(alpha);
  const [ColorConstructor, params] = MODEL_PARAMS[model];
  if (m.startsWith('p3:')) m = (m.substring(3) as keyof typeof MODEL_PARAMS);

  /** anyfying JS magic, trust the system */
  return (ColorConstructor as any)[`${model}Array`]((params as any).map((p: string) => {
    if (p === 'hue') return (_start as any)[p] + factor * getHueDiff((_start as any)[p], (_end as any)[p], hueDirection);
    if (p === 'alpha') return (_start as any)[p] * (1 + factor);
    return (_start as any)[p] + factor * ((_end as any)[p] - (_start as any)[p]);
  }));
}
