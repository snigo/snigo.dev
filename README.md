# snigo.dev
Open-source stuff by @snigo

## color

Color types and functions for JavaScript

```js

import { color, lerp } from '@snigos/color';

const lab = color('hsl(209deg 95% 65% / .35)').toLab(); /* => LabColor {
  a: -7.519,
  alpha: 0.35,
  b: -49.436,
  chroma: 50.005,
  hue: 261.352,
  lightness: 0.66612,
  profile: "cie-lab",
} */

const p3 = lab.toP3(); /* => DisplayP3Color {
  alpha: 0.35,
  blue: 244,
  green: 167,
  hue: 213,
  lightness: 0.68235,
  profile: "display-p3",
  red: 104,
  saturation: 0.8642,
} */

const arr = lerp('lch', { start: 'aliceblue', end: lab, stops: 4 }); // => LabColor[]
arr.map((c) => c.toRgb().toHexString()); // => ["#f0f8ff", "#d2e9fede", "#b4d9fdbd", "#96c9fc9c", "#76b9fc7a", "#51a9fb59"]
```

---

## AliasMap

Bi-directional map with support of aliases

```js

import AliasMap from '@snigo.dev/aliasmap';

const countries = new AliasMap();

countries.set('United Kingdom', 'gb');
countries.setAlias('gb', 'United Kingdom of Great Britain and Northern Ireland', 'UK', 'U.K.', 'Great Britain', 'Britain', 'GBR', 'England', 'Northern Ireland', 'Scotland', 'Wales');

countries.getKey('gb'); // "United Kingdom"
countries.getKey('Scotland'); // "United Kingdom"
countries.getKey('United Kingdom'); // "United Kingdom"
countries.getKey('USA'); // undefined

```

---

## Range

Range class for JavaScript

```js

import Range from '@snigo.dev/range';

const range = new Range(0, 99, 5);
// => Range {from: 0, to: 99, step: 5}

range.clamp(100); // 99
range.clamp(-42); // 0
range.has(15); // true
range.mod(-45); // 55
range.slice(4); // [0, 26, 52, 78]

```

---

## mathx

Collection of useful math functions for everyday JS

```js

import { random, round, num } from '@snigo.dev/range';

const a = num('34.5%'); // 0.345
const b = random([-5, 5], 4); // -2.8183
const c = round(a ** b, 4); // 20.0708
precision(c); // 4

```