# `@snigo.dev/cf`

Collection of compare functions for everyday use, providing three different methods of sorting:
- Alphanumeric: standard sorting by character code
- Numeric: numbers sorted before any textual content
- DateTime: sorting by parsable date (based on `Date.parse`)

## Usage

```js
import { cfDateTimeBy } from '@snigo.dev/cf';

const users = [
  { name: 'Jeff', dob: 'January 12, 1964' },
  { name: 'Elon', dob: 'June 28, 1971' },
  { name: 'Bill', dob: 'October 28, 1955' },
  { name: 'Mark', dob: 'May 14, 1984' },
];

[...users].sort(cfDateTimeBy('dob', 'desc'));
/**
 * => [
 *   { name: 'Mark', dob: 'May 14, 1984' },
 *   { name: 'Elon', dob: 'June 28, 1971' },
 *   { name: 'Jeff', dob: 'January 12, 1964' },
 *   { name: 'Bill', dob: 'October 28, 1955' },
 * ]
 * /
```

## Motivation

Provide higher comparing abstraction for sorting methods.

## API

