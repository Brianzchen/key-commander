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

func: (
  event: KeyboardEvent,
  {
    // Use this to determine if the currently focused element
    // when then event occurs has a tab index such as an input
    // where you may not want to trigger your function
    onTabElement: boolean,
  }
) => void
options: {
  // At what stage of the user input you would like the function called
  event: 'keyup' | 'keydown' | 'keypress' // default: keydown
  // If you want the function called only when one or more modifiers are active
  modifier: void | 'ctrl' | 'shift' | Array<'ctrl' | 'shift'> // default: void
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
    const id = kc.subscribe('b', (event, { onTabElement }) => {
      if (!onTabElement) {
        // close menu
      }
    }, { onRepeat: true });

    return () => {
      kc.ubsub(id);
    };
  });

  return <div />;
}
```
