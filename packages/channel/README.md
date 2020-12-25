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