# key-commander
A centralised keyboard listener for parts of an application to subscribe to.

Runs a single event listener for `keyup`, `keydown`, and `keypress` that can be subscribed to, and the functions you pass in will not be called unless all defined option criterias are satisfied.

## API
```js
const kc = {
  subscribe: (key: string, func, options) => subId: string,
  unsub: (subId: string) => void,
  getList: () => Array<{
    id: string,
    key: string,
    func,
    options,
  }>
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
  // You may experience issues with alt/meta modifiers depending on browsers as they may be attached to other browser functionality
  modifier: void | 'alt' | 'ctrl' | 'meta' | 'shift' | Array<'alt' | 'ctrl' | 'meta' | 'shift'> // default: void
  // If you want the function called multiple times if the user holds down a particular key
  onRepeat: boolean // default false
}
```

## Usage

```js
import KeyCommander from 'key-commander';

const kc = new KeyCommander();

const subId = kc.subscribe('escape', () => {});

kc.unsub(subId);
```

With React:
```js
import React from 'react';
import KeyCommander from 'key-commander';

const kc = new KeyCommander();

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

## Single Instance

Alternatively, if you don't want to manage your own instance you can have `key-commander` run its own that's stored in an abstracted window object. Otherwise you can manage the instance yourself, by passing the functionality through react context for example.

```js
import kc from 'key-commander/instanced';
```

You can also simplify this with module resolution such as [babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports) so you only need to type `import kc from 'key-commander'` when importing.

```js
[
  'transform-imports',
  {
    'key-commander': {
      transform: 'key-commander/instanced',
      preventFullImport: true,
    },
    // other transforms ...
  },
],
```
