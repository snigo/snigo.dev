/* eslint-disable no-new-wrappers */
/* eslint-disable no-multi-spaces */
// @ts-nocheck
import {
  cfAlphanumeric,
  cfAlphanumericAsc,
  cfAlphanumericBy,
  cfAlphanumericDesc,
  cfDateTime,
  cfDateTimeAsc,
  cfDateTimeBy,
  cfDateTimeDesc,
  cfNumeric,
  cfNumericAsc,
  cfNumericBy,
  cfNumericDesc,
} from '../src';

import {
  users,
  usersByNameAsc,
  usersByNameDesc,
  usersByFollowersAsc,
  usersByFollowersDesc,
  usersByDateOfBirthAsc,
  usersByDateOfBirthDesc,
} from './users.mock';

test('alphanumeric sorting', () => {
  expect(cfAlphanumeric('alpha', 'zeta', 'asc')).toBe(-1);
  expect(cfAlphanumeric('alpha', 'zeta')).toBe(-1);
  expect(cfAlphanumeric('alpha', 'zeta', 'desc')).toBe(1);
  expect(cfAlphanumericAsc('alpha', 'zeta')).toBe(-1);
  expect(cfAlphanumericDesc('alpha', 'zeta')).toBe(1);

  expect(cfAlphanumeric('blockchain', 'bitcoin', 'asc')).toBe(1);
  expect(cfAlphanumeric('blockchain', 'bitcoin')).toBe(1);
  expect(cfAlphanumeric('blockchain', 'bitcoin', 'desc')).toBe(-1);
  expect(cfAlphanumericAsc('blockchain', 'bitcoin')).toBe(1);
  expect(cfAlphanumericDesc('blockchain', 'bitcoin')).toBe(-1);

  expect(cfAlphanumeric('precious', 'precious', 'asc')).toBe(0);
  expect(cfAlphanumeric('precious', 'precious')).toBe(0);
  expect(cfAlphanumeric('precious', 'precious', 'desc')).toBe(0);
  expect(cfAlphanumericAsc('precious', 'precious')).toBe(0);
  expect(cfAlphanumericDesc('precious', 'precious')).toBe(0);

  expect(cfAlphanumeric(1, 'zeta', 'asc')).toBe(-1);
  expect(cfAlphanumeric(1, 'zeta')).toBe(-1);
  expect(cfAlphanumeric(1, 'zeta', 'desc')).toBe(1);
  expect(cfAlphanumericAsc(1, 'zeta')).toBe(-1);
  expect(cfAlphanumericDesc(1, 'zeta')).toBe(1);

  expect(cfAlphanumeric('blockchain', [1, 2, 3], 'asc')).toBe(1);
  expect(cfAlphanumeric('blockchain', [1, 2, 3])).toBe(1);
  expect(cfAlphanumeric('blockchain', [1, 2, 3], 'desc')).toBe(-1);
  expect(cfAlphanumericAsc('blockchain', [1, 2, 3])).toBe(1);
  expect(cfAlphanumericDesc('blockchain', [1, 2, 3])).toBe(-1);

  expect(cfAlphanumeric(42, '42', 'asc')).toBe(0);
  expect(cfAlphanumeric(42, '42')).toBe(0);
  expect(cfAlphanumeric(42, '42', 'desc')).toBe(0);
  expect(cfAlphanumericAsc(42, '42')).toBe(0);
  expect(cfAlphanumericDesc(42, '42')).toBe(0);

  expect(cfAlphanumeric('23', 4, 'asc')).toBe(-1);
  expect(cfAlphanumeric('23', 4)).toBe(-1);
  expect(cfAlphanumeric('23', 4, 'desc')).toBe(1);
  expect(cfAlphanumericAsc('23', 4)).toBe(-1);
  expect(cfAlphanumericDesc('23', 4)).toBe(1);

  expect(cfAlphanumeric('53', 4, 'asc')).toBe(1);
  expect(cfAlphanumeric('53', 4)).toBe(1);
  expect(cfAlphanumeric('53', 4, 'desc')).toBe(-1);
  expect(cfAlphanumericAsc('53', 4)).toBe(1);
  expect(cfAlphanumericDesc('53', 4)).toBe(-1);

  expect(cfAlphanumeric(false, true, 'asc')).toBe(-1);
  expect(cfAlphanumeric(false, true)).toBe(-1);
  expect(cfAlphanumeric(false, true, 'desc')).toBe(1);
  expect(cfAlphanumericAsc(false, true)).toBe(-1);
  expect(cfAlphanumericDesc(false, true)).toBe(1);

  expect(cfAlphanumeric(null, undefined, 'asc')).toBe(-1);
  expect(cfAlphanumeric(null, undefined)).toBe(-1);
  expect(cfAlphanumeric(null, undefined, 'desc')).toBe(1);
  expect(cfAlphanumericAsc(null, undefined)).toBe(-1);
  expect(cfAlphanumericDesc(null, undefined)).toBe(1);

  expect(cfAlphanumeric()).toBe(0);
  expect(cfAlphanumericAsc()).toBe(0);
  expect(cfAlphanumericDesc()).toBe(0);

  const unsorted = ['squidward', '#ff2312', 1234, 'js', 'P', 0xff, null, undefined, NaN, 94, 23, 'Sevilla', 'ßraun', 13, 2, 8, true, [3, 5, 3], 'sausage', 'Alice', false];
  const ascSorted = ['#ff2312', 1234, 13, 2, 23, 255, [3, 5, 3], 8, 94, 'Alice', false, 'js', NaN, null, 'P', 'sausage', 'Sevilla', 'squidward', 'ßraun', true, undefined];
  const descSorted = [...ascSorted].reverse();

  expect([...unsorted.sort(cfAlphanumeric)]).toEqual(ascSorted);
  expect([...unsorted.sort(cfAlphanumericAsc)]).toEqual(ascSorted);
  expect([...unsorted.sort(cfAlphanumericDesc)]).toEqual(descSorted);

  expect([...users.sort(cfAlphanumericBy('name'))]).toEqual(usersByNameAsc);
  expect([...users.sort(cfAlphanumericBy('name', 'asc'))]).toEqual(usersByNameAsc);
  expect([...users.sort(cfAlphanumericBy('name', 'desc'))]).toEqual(usersByNameDesc);
});

test('datetime sorting', () => {
  const sooner = new Date('Dec 10, 2020');
  const later = new Date('August 12, 2021');
  const secondSooner = new Date(1998, 4, 12, 8, 6, 56);
  const secondLater = new Date(1998, 4, 12, 8, 6, 57);

  expect(cfDateTime(sooner, later, 'asc') < 0).toBe(true);
  expect(cfDateTime(sooner, later) < 0).toBe(true);
  expect(cfDateTime(sooner, later, 'desc') < 0).toBe(false);
  expect(cfDateTimeAsc(sooner, later) < 0).toBe(true);
  expect(cfDateTimeDesc(sooner, later) < 0).toBe(false);

  expect(cfDateTime(secondLater, secondSooner, 'asc')).toBe(1000);
  expect(cfDateTime(secondLater, secondSooner)).toBe(1000);
  expect(cfDateTime(secondLater, secondSooner, 'desc')).toBe(-1000);
  expect(cfDateTimeAsc(secondLater, secondSooner)).toBe(1000);
  expect(cfDateTimeDesc(secondLater, secondSooner)).toBe(-1000);

  expect(cfDateTime(sooner, sooner, 'asc')).toBe(0);
  expect(cfDateTime(later, later)).toBe(0);
  expect(cfDateTime(secondSooner, secondSooner, 'desc')).toBe(0);
  expect(cfDateTimeAsc(secondLater, secondLater)).toBe(0);
  expect(cfDateTimeDesc(new Date(), new Date())).toBe(0);

  expect(cfDateTime(1, '49', 'asc') < 0).toBe(true);
  expect(cfDateTime(1, '49') < 0).toBe(true);
  expect(cfDateTime(1, '49', 'desc') < 0).toBe(false);
  expect(cfDateTimeAsc(1, '49') < 0).toBe(true);
  expect(cfDateTimeDesc(1, '49') < 0).toBe(false);

  expect(cfDateTime('apple', 'Sep 13, 2077', 'asc')).toBe(1);
  expect(cfDateTime('apple', 'Sep 13, 2077')).toBe(1);
  expect(cfDateTime('apple', 'Sep 13, 2077', 'desc')).toBe(-1);
  expect(cfDateTimeAsc('apple', 'Sep 13, 2077')).toBe(1);
  expect(cfDateTimeDesc('apple', 'Sep 13, 2077')).toBe(-1);

  expect(cfDateTime(1981, '1981', 'asc')).toBe(0);
  expect(cfDateTime(1981, '1981')).toBe(0);
  expect(cfDateTime(1981, '1981', 'desc')).toBe(0);
  expect(cfDateTimeAsc(1981, '1981')).toBe(0);
  expect(cfDateTimeDesc(1981, '1981')).toBe(0);

  expect(cfDateTime('49', '50', 'asc') < 0).toBe(false);
  expect(cfDateTime('49', '50') < 0).toBe(false);
  expect(cfDateTime('49', '50', 'desc') < 0).toBe(true);
  expect(cfDateTimeAsc('49', '50') < 0).toBe(false);
  expect(cfDateTimeDesc('49', '50') < 0).toBe(true);

  expect(cfDateTime([2015, 3, 6], [2018, 3, 1], 'asc') < 0).toBe(true);
  expect(cfDateTime([2015, 3, 6], [2018, 3, 1]) < 0).toBe(true);
  expect(cfDateTime([2015, 3, 6], [2018, 3, 1], 'desc') < 0).toBe(false);
  expect(cfDateTimeAsc([2015, 3, 6], [2018, 3, 1]) < 0).toBe(true);
  expect(cfDateTimeDesc([2015, 3, 6], [2018, 3, 1]) < 0).toBe(false);

  expect(cfDateTime(false, true, 'asc')).toBe(-1);
  expect(cfDateTime(false, true)).toBe(-1);
  expect(cfDateTime(false, true, 'desc')).toBe(1);
  expect(cfDateTimeAsc(false, true)).toBe(-1);
  expect(cfDateTimeDesc(false, true)).toBe(1);

  expect(cfDateTime(null, undefined, 'asc')).toBe(-1);
  expect(cfDateTime(null, undefined)).toBe(-1);
  expect(cfDateTime(null, undefined, 'desc')).toBe(1);
  expect(cfDateTimeAsc(null, undefined)).toBe(-1);
  expect(cfDateTimeDesc(null, undefined)).toBe(1);

  expect(cfDateTime()).toBe(0);
  expect(cfDateTimeAsc()).toBe(0);
  expect(cfDateTimeDesc()).toBe(0);

  const unsorted = ['sponge bob', '#javascript', 1234, 'Jan 1, 2021', 'P', 0xff, null, undefined, NaN, 94, 23, '1987-05-24', 'ßraun', 13, 2, 8, true, [3, 5, 3], 'sausage', 'Alice', false];
  const dateAscSorted = [
    255,            // Jan 1, 255
    1234,           // Jan 1, 1235
    '1987-05-24',   // May 24, 1987
    94,             // Jan 1, 1994
    2,              // Feb 1, 2001
    8,              // Aug 1, 2001
    [3, 5, 3],      // May 3, 2003
    'Jan 1, 2021',  // Jan 1, 2021
    '#javascript',  // ...rest sorted alphanumerically
    13,             // Non parsable integer `Date.parse(13)` => NaN
    23,             // Non parsable integer `Date.parse(23)` => NaN
    'Alice',
    false,
    NaN,
    null,
    'P',
    'sausage',
    'sponge bob',
    'ßraun',
    true,
    undefined,
  ];
  const dateDescSorted = [...dateAscSorted].reverse();

  expect([...unsorted.sort(cfDateTime)]).toEqual(dateAscSorted);
  expect([...unsorted.sort(cfDateTimeAsc)]).toEqual(dateAscSorted);
  expect([...unsorted.sort(cfDateTimeDesc)]).toEqual(dateDescSorted);

  expect([...users.sort(cfDateTimeBy('dateOfBirth'))]).toEqual(usersByDateOfBirthAsc);
  expect([...users.sort(cfDateTimeBy('dateOfBirth', 'asc'))]).toEqual(usersByDateOfBirthAsc);
  expect([...users.sort(cfDateTimeBy('dateOfBirth', 'desc'))]).toEqual(usersByDateOfBirthDesc);
});

test('numeric sorting', () => {
  expect(cfNumeric(345, 9643, 'asc') < 0).toBe(true);
  expect(cfNumeric(345, 9643) < 0).toBe(true);
  expect(cfNumeric(345, 9643, 'desc') < 0).toBe(false);
  expect(cfNumericAsc(345, 9643) < 0).toBe(true);
  expect(cfNumericDesc(345, 9643) < 0).toBe(false);

  expect(cfNumeric('22', 21, 'asc')).toBe(1);
  expect(cfNumeric('22', 21)).toBe(1);
  expect(cfNumeric('22', 21, 'desc')).toBe(-1);
  expect(cfNumericAsc('22', 21)).toBe(1);
  expect(cfNumericDesc('22', 21)).toBe(-1);

  expect(cfNumeric(43, 43, 'asc')).toBe(0);
  expect(cfNumeric('43', '43')).toBe(0);
  expect(cfNumeric(0x2b, 43, 'desc')).toBe(0);
  expect(cfNumericAsc('43', 43)).toBe(0);
  expect(cfNumericDesc(new Number(43), new Number(43))).toBe(0);

  expect(cfNumeric('100', '49', 'asc') < 0).toBe(false);
  expect(cfNumeric('100', '49') < 0).toBe(false);
  expect(cfNumeric('100', '49', 'desc') < 0).toBe(true);
  expect(cfNumericAsc('100', '49') < 0).toBe(false);
  expect(cfNumericDesc('100', '49') < 0).toBe(true);

  expect(cfNumeric('apple', '13', 'asc')).toBe(1);
  expect(cfNumeric('apple', '13')).toBe(1);
  expect(cfNumeric('apple', '13', 'desc')).toBe(-1);
  expect(cfNumericAsc('apple', '13')).toBe(1);
  expect(cfNumericDesc('apple', '13')).toBe(-1);

  expect(cfNumeric(1981, '1-800-800-80-80', 'asc')).toBe(-1);
  expect(cfNumeric(1981, '1-800-800-80-80')).toBe(-1);
  expect(cfNumeric(1981, '1-800-800-80-80', 'desc')).toBe(1);
  expect(cfNumericAsc(1981, '1-800-800-80-80')).toBe(-1);
  expect(cfNumericDesc(1981, '1-800-800-80-80')).toBe(1);

  expect(cfNumeric('.56', '0.560001', 'asc') < 0).toBe(true);
  expect(cfNumeric('.56', '0.560001') < 0).toBe(true);
  expect(cfNumeric('.56', '0.560001', 'desc') < 0).toBe(false);
  expect(cfNumericAsc('.56', '0.560001') < 0).toBe(true);
  expect(cfNumericDesc('.56', '0.560001') < 0).toBe(false);

  expect(cfNumeric('number', 'string', 'asc')).toBe(-1);
  expect(cfNumeric('number', 'string')).toBe(-1);
  expect(cfNumeric('number', 'string', 'desc')).toBe(1);
  expect(cfNumericAsc('number', 'string')).toBe(-1);
  expect(cfNumericDesc('number', 'string')).toBe(1);

  expect(cfNumeric(false, true, 'asc')).toBe(-1);
  expect(cfNumeric(false, true)).toBe(-1);
  expect(cfNumeric(false, true, 'desc')).toBe(1);
  expect(cfNumericAsc(false, true)).toBe(-1);
  expect(cfNumericDesc(false, true)).toBe(1);

  expect(cfNumeric(null, undefined, 'asc')).toBe(-1);
  expect(cfNumeric(null, undefined)).toBe(-1);
  expect(cfNumeric(null, undefined, 'desc')).toBe(1);
  expect(cfNumericAsc(null, undefined)).toBe(-1);
  expect(cfNumericDesc(null, undefined)).toBe(1);

  expect(cfNumeric()).toBe(0);
  expect(cfNumericAsc()).toBe(0);
  expect(cfNumericDesc()).toBe(0);

  const unsorted = [4, true, 7, 'b', 2, '8', -2, [1, 2, 3], 9, 'c', '6', 0, false, 2, 4, -7, {}, 6, -0, '7', NaN, '34', Infinity, 2, '5', 7, undefined, 3, '56', null, 'Infinity', 768, 'a'];
  const numSortedAsc = [-7, -2, 0, false, -0, true, 2, 2, 2, 3, 4, 4, '5', '6', 6, 7, '7', 7, '8', 9, '34', '56', 768, Infinity, 'Infinity', {}, [1, 2, 3], 'a', 'b', 'c', NaN, null, undefined];
  const numSortedDesc = [...numSortedAsc].reverse();

  expect([...unsorted.sort(cfNumeric)]).toEqual(numSortedAsc);
  expect([...unsorted.sort(cfNumericAsc)]).toEqual(numSortedAsc);
  expect([...unsorted.sort(cfNumericDesc)]).toEqual(numSortedDesc);

  expect([...users.sort(cfNumericBy('followers'))]).toEqual(usersByFollowersAsc);
  expect([...users.sort(cfNumericBy('followers', 'asc'))]).toEqual(usersByFollowersAsc);
  expect([...users.sort(cfNumericBy('followers', 'desc'))]).toEqual(usersByFollowersDesc);
});
