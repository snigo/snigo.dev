// @ts-nocheck
import Mirror from '../src/mirror';

test('mirroring the passed object', () => {
  const object = { name: 'Alice', age: 32 };
  const mirror = new Mirror(object);

  expect(mirror).toEqual(object);
  expect(mirror).toHaveProperty('name', 'Alice');
  expect(mirror).toHaveProperty('age', 32);

  expect(Mirror).toThrow();
  const emptyMirror = new Mirror();
  expect(emptyMirror).toEqual({});
});

test('Non-object arguments', () => {
  const arr = [1, 2, 3];
  const arrMirror = new Mirror(arr);
  expect(arrMirror).toEqual({ 0: 1, 1: 2, 2: 3 });

  const nonConvertables = [
    new Date(),
    true,
    null,
    42,
    45n,
    NaN,
    Symbol('my symbol is the best'),
  ];
  nonConvertables.forEach((nc) => {
    expect(new Mirror(nc)).toEqual({});
  });

  const div = document.createElement('div');
  const p1 = document.createElement('p');
  const p2 = document.createElement('p');
  p1.textContent = 'Now we declare the Person specific type and Dictionary/Dictionary interface.';
  p2.textContent = 'In the PersonDictionary note how we override values() and toLookup().';
  div.append(p1, p2);
  const divMirror = new Mirror(div.children);
  expect(divMirror).toEqual({ 0: p1, 1: p2 });

  const string = 'WoW';
  const stringMirror = new Mirror(string);
  expect(stringMirror).toEqual({ 0: 'W', 1: 'o', 2: 'W' });
});

test('Extra arguments', () => {
  const mirror = new Mirror({ name: 'Spartacus' }, true, 43, { one: 'more' });
  expect(mirror).toEqual({ name: 'Spartacus' });
});
