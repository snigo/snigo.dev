# Channel

Easy to use pub/sub proxy decorator

## Usage

In the terminal:
```

% npm install @snigo.dev/channel

```

Then in the module:
```js

// JavaScript modules
import { withChannel } from '@snigo.dev/channel';

// Implement "Hello world" of reactive programming:
class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count += 1;
  }
}

const Counter$ = withChannel(Counter);

const myCounter = new Counter$();

// If you ever tried rxjs, this will be familiar:
const subscription = myCounter.subscribe({
  count: (value) => {
    console.log(`The count is: ${value}`);
  }
});

myCounter.increment(); // Logs: "The count is: 1"
myCounter.count = 2; // Logs: "The count is: 2"

subscription.unsubscribe('count');

myCounter.increment(); // Logs nothing

myCounter.count; // 3

```

## Motivation

Making pub/sub a bit more accessible and a bit more straight-forward: you have an object or instance and you subscribe to any of properties, whenever property changes your callback is invoked. I want something that I can explain to a beginner who just started learing JavaScript few weeks ago, something to be the same complexity as `setTimeout` or `Element.addEventListener`.

Another particular reason - decentralizing centralized state. Imagine we store our app state in centralized manner, let's say React context. What if we'll never change it's value, but will allow any component or subtree to subscribe to parts of the state and manage their state locally? This way, in my opinion, we'll still have centralized state nicely stored while not having top-to-bottom re-renders and let components be a bit more independent.

```js

// React

function useCalculator() {
  // Singleton
  const calculator = new Calculator$();
  const [value, __setValue] = useState(calculator.value);

  useEffect(() => {
    const subscription = calculator.subscribe({
      value: (newValue) {
        __setValue(newValue);
      }
    });
  });

  return () => {
    subscription.unsubscribe('value');
  };

  return [value, calculator];
}

// Interactive component
const calculator = new Calculator$();

return <button type="button" onClick={() => calculator.eval('2 + 2 * 20')}>=</button>;

// Display component

const [value] = useCalculator();

return <div>{value}</div>;

```

On the surface this might seem like still a lot of coupling inside `useCalculator()` function, but for larger interfaces this hook will always stay the same and will act as a "driver" for the interface and at the moment when frontend library will change it's API or you will decide to switch to another library, the only thing you will need to rewrite is this "driver" function without worrying about anything else.

## API

### `withChannel(wrappedClass)`

Class decorator, extends given wrapped class and returns new decorated class whose instances would be proxy channels.

| **Parameter** | **Type**  | **Default value** | **Notes**                      |
|---------------|-----------|-------------------|--------------------------------|
| `wrappedClass`| `Function`|                   | Class to be decorated          |

```js

import { withChannel } from 'snigo.dev/channel';

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const Person$ = withChannel(Person);
const person = new Person$('Alice', 23);

person.subscribe({
  'age': (value, target) => {
    console.log(`Happy ${value} Birthday, ${target.name}!`);
  }
});

person.age = 24;
// => Logs "Happy 24 Birthday, Alice!"

```

#### Usage with typescript

You can use `withChannel` as class decorators in typescript. More info here: https://www.typescriptlang.org/docs/handbook/decorators.html

```ts

import { withChannel } from 'snigo.dev/channel';

@withChannel
class Person {
  public name: string;

  public age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const person = new Person('Alice', 23);

person.subscribe({
  'age': (value, target) => {
    console.log(`Happy ${value} Birthday, ${target.name}!`);
  }
});

person.age = 24;
// => Logs "Happy 24 Birthday, Alice!"

```

***

### `channel(object)`

Proxyfies given object returning proxy channel instance of the object.

| **Parameter** | **Type**  | **Default value** | **Notes**                      |
|---------------|-----------|-------------------|--------------------------------|
| `object`      | `Object`  |                   | Object to be proxyfied         |

```js

import { channel } from 'snigo.dev/channel';

const obj = { name: 'Bob', age: 34 };
const bobChannel = channel(obj);

bobChannel.subscribe({
  'age': (value, target) => {
    console.log(`Happy ${value} Birthday, ${target.name}!`);
  }
});

bobChannel.age = 35;
// => Logs "Happy 35 Birthday, Bob!"

```

***

### `Channel`

Proxy channel class. 

#### `Channel.prototype.subscribe(subscriptionDescriptor)`

Subscribes to a particular property of proxy channel.

| **Parameter**           | **Type**             | **Default value** | **Notes**                      |
|-------------------------|----------------------|-------------------|--------------------------------|
| `subscriptionDescriptor`| `SubscriptionTopic`  |                   | Subscription descriptor object |

`subscriptionDescriptor` object is an object with keys represent properties to subscribe to and values callback function that will be called each time those properties will be changed. `SubscriptionCallback` will be called with two arguments:
- `value`: new value of the property
- `target`: the proxy channel instance

*Note: the `target` in callback function will still have previous value of a property that has been changed:

```js

import { channel } from 'snigo.dev/channel';

const stateChannel = channel({ count: 4 });

const subscriptionCallback = (value, target) => {
  console.log(`Value has been changed from ${target.count} to ${value}`);
};

const subscriptionDescriptor = {
  count: subscriptionCallback,
};

const sub = stateChannel.subscribe(subscriptionDescriptor);

stateChannel.count = 20;
// => Logs "Value has been changed from 4 to 20"

```

Returns `SubscriptionReceipt` allowing to unsubscribe from properties:

```js

// If no argument provided will unsubscribe from all properties
sub.unsubscribe();

stateChannel.count = 22;
// => Logs nothing

```

***

#### `Channel.prototype.unsubscribe(id, [key])`

Allows channel proxy to unsubscribe certain subscribers by id. Rarely will be needed.

| **Parameter**  | **Type**     | **Default value** | **Notes**                                  |
|----------------|--------------|-------------------|--------------------------------------------|
| `id`           | `number`     |                   | Subscription id                            |
| `key`          | `string`     |                   | Optional property name to unsubscribe from |

If `key` isn't provided will unsubscribe subscription with given `id` from all properties.

***

#### `Channel.prototype.push(key, value)`

Pushes new value for given key. It will have the same result if value is simply reassigned with the only difference that `.push()` will return proxy channel instance back allowing chaining.

| **Parameter**  | **Type**     | **Default value** | **Notes**                              |
|----------------|--------------|-------------------|----------------------------------------|
| `key`          | `string`     |                   | Property to be updated                 |
| `value`        | `any`        |                   | New value for given property           |

```js

import { channel } from 'snigo.dev/channel';

const taskChannel = channel({ tasks: [] });
const addTask = (channel, task) => channel.push('tasks', [...channel.tasks, task]);

