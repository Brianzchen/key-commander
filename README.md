# key-commander
A centralised keyboard listener for parts of an application to subscribe to

Runs a single event listener for `keyup`, `keydown`, and `keypress` that can be subscribed to, and the functions you pass in will not be called unless all defined option criterias are satisfied.

## API
```js
module.exports = {
  subscribe: (func, options) => subId: number,
  unsub: (subId: number) => void,
}

// ---

func: ({ key: string }) => void
options: {
  event: 'keyup' | 'keydown' | 'keypress' // default: keydown
  modifier: void | 'alt' | 'ctrl' | 'meta' | 'shift' | Array<'alt' | 'ctrl' | 'meta' | 'shift'> // default: void
}
```

## Usage

```js
import kc from 'key-commander';

const subId = kc.subscribe(() => {});

kc.unsub(subId);
```
