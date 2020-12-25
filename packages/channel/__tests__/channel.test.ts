// @ts-nocheck
/* eslint-disable max-classes-per-file */
/* eslint-disable no-param-reassign */
import { withChannel, channel } from '../src';
import SubscriptionReceipt from '../src/receipt';

const testPerson = (person) => {
  expect(person).toHaveProperty('name', 'Bobbie');
  expect(person).toHaveProperty('age', 29);
  expect(typeof person.subscribe).toBe('function');
  expect(typeof person.unsubscribe).toBe('function');
  expect(typeof person.push).toBe('function');

  const ageCb = jest.fn();
  const ageSub = person.subscribe({
    age: ageCb,
  });
  const nameCb = jest.fn();
  const nameSub = person.subscribe({
    name: nameCb,
  });

  expect(ageSub).toBeInstanceOf(SubscriptionReceipt);
  expect(nameSub).toBeInstanceOf(SubscriptionReceipt);
  expect(typeof ageSub.unsubscribe).toBe('function');
  expect(typeof nameSub.unsubscribe).toBe('function');

  person.age = 30;
  expect(ageCb.mock.calls[0][0]).toBe(30);
  expect(ageCb.mock.calls[0][1]).toEqual(person);

  person.name = 'Molly';
  expect(nameCb.mock.calls[0][0]).toBe('Molly');
  expect(nameCb.mock.calls[0][1]).toEqual(person);

  person.age = 24;
  ageSub.unsubscribe();
  nameSub.unsubscribe();

  person.age = 21;
  person.name = 'Alan';

  expect(ageCb).toBeCalledTimes(2);
  expect(nameCb).toBeCalledTimes(1);

  const multiAgeCb = jest.fn();
  const multiNameCb = jest.fn();
  const multiSub = person.subscribe({
    age: multiAgeCb,
    name: multiNameCb,
  });

  person.age = 57;
  person.name = 'Donald';

  multiSub.unsubscribe('age');

  person.name = 'Nick';
  person.age = 19;

  expect(multiAgeCb).toBeCalledTimes(1);
  expect(multiNameCb).toBeCalledTimes(2);
};

test('class decorator', () => {
  @withChannel
  class Person {
    name: string;

    age: number;

    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
    }
  }

  const person = new Person('Bobbie', 29);
  testPerson(person);
});

test('class wrapper', () => {
  class Person {
    name: string;

    age: number;

    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
    }
  }

  const person = new (withChannel(Person))('Bobbie', 29);
  testPerson(person);
});

test('channel function', () => {
  const bobbie = { name: 'Bobbie', age: 29 };

  const bobbie$ = channel(bobbie);
  expect(bobbie$).toHaveProperty('name', 'Bobbie');
  expect(bobbie$).toHaveProperty('age', 29);
  testPerson(bobbie$);
});
