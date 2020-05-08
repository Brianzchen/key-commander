# key-commander
A centralised keyboard listener for parts of an application to subscribe to

Runs a single event listener for `keyup`, `keydown`, and `keypress` that can be subscribed to, and the functions you pass in will not be called unless all defined option criterias are satisfied.

## API
```js
module.exports = {
  subscribe: (key: string, func, options) => subId: string,
  unsub: (subId: string) => void,
}

// ---

func: (event: KeyboardEvent) => void
options: {
  // At what stage of the user input you would like the function called
  event: 'keyup' | 'keydown' | 'keypress' // default: keydown
  // If you want the function called only when one or more modifiers are active
  modifier: void | 'alt' | 'ctrl' | 'meta' | 'shift' | Array<'alt' | 'ctrl' | 'meta' | 'shift'> // default: void
  // If you want the function called multiple times if the user holds down a particular key
  onRepeat: boolean // default false
}
```

## Usage

```js
import kc from 'key-commander';

const subId = kc.subscribe('escape', () => {});

kc.unsub(subId);
```

With React:
```js
import React from 'react';
import kc from 'key-commander';

const Comp = () => {
  useEffect(() => {
    const id = kc.subscribe('b', (event) => {
      // close menu
    }, { onRepeat: true });

    return () => {
      kc.ubsub(id);
    };
  });

  return <div />;
}
```
