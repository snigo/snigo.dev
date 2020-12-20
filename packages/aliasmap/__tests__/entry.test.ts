// @ts-nocheck
import Entry from '../src/entry';

test('creating Entry instance', () => {
  const entry = new Entry('foo', 'bar');

  expect(entry).toBeInstanceOf(Entry);
  expect(entry).toHaveProperty('key', 'foo');
  expect(entry).toHaveProperty('value', 'bar');

  expect(Entry).toThrow();

  const emptyEntry = new Entry();
  expect(emptyEntry).toHaveProperty('key', undefined);
  expect(emptyEntry).toHaveProperty('value', undefined);
});
