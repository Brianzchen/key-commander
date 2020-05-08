// @flow
type KeyT = 'keyup' | 'keydown' | 'keypress';
type ModifierT = 'alt' | 'ctrl' | 'meta' | 'shift';

type OptionsT = {
  event: KeyT,
  modifier?: ModifierT | Array<ModifierT>,
};

type EventFuncT = {
  id: string,
  key: string,
  func: Function,
  options: OptionsT,
}

type EventFuncListT = Array<EventFuncT>

class KeyCommander {
  keyupFuncs: EventFuncListT;

  keydownFuncs: EventFuncListT;

  keypressFuncs: EventFuncListT;

  constructor() {
    this.keyupFuncs = [];
    this.keydownFuncs = [];
    this.keypressFuncs = [];

    (this: any).listener = this.listener.bind(this);
    (this: any).subscribe = this.subscribe.bind(this);
    (this: any).unsub = this.unsub.bind(this);

    window.addEventListener('keyup', (event) => this.listener(event, 'keyup'));
    window.addEventListener('keydown', (event) => this.listener(event, 'keydown'));
    window.addEventListener('keypress', (event) => this.listener(event, 'keypress'));
  }

  getFuncArray(event: KeyT) {
    switch (event) {
      case 'keyup':
        return this.keyupFuncs;
      case 'keydown':
        return this.keydownFuncs;
      case 'keypress':
        return this.keypressFuncs;
      default:
        return [];
    }
  }

  listener(event: KeyboardEvent, keyEvent: KeyT) {
    const funcs = this.getFuncArray(keyEvent);
    for (let i = 0, len = funcs.length; i < len; i++) {
      const funcObj: EventFuncT = funcs[i];
      if (funcObj.key === event.key) {
        const { modifier } = funcObj.options;
        if (typeof modifier === 'string') {
          if (modifier === 'alt' && event.altKey) {
            funcObj.func();
          } else if (modifier === 'ctrl' && event.ctrlKey) {
            funcObj.func();
          } else if (modifier === 'meta' && event.metaKey) {
            funcObj.func();
          } else if (modifier === 'shift' && event.shiftKey) {
            funcObj.func();
          }
        } else if (Array.isArray(modifier)) {
          const conditions: Array<boolean> = modifier.map((o) => {
            if (o === 'alt') return event.altKey;
            if (o === 'ctrl') return event.ctrlKey;
            if (o === 'meta') return event.metaKey;
            if (o === 'shift') return event.shiftKey;
            return true;
          });
          const isAllModifiersSelected = conditions.reduce((prev, curr) => {
            if (prev) {
              return curr;
            }
            return prev;
          }, true);
          if (isAllModifiersSelected) {
            funcObj.func();
          }
        } else {
          funcObj.func();
        }
      }
    }
  }

  subscribe(
    key: string,
    func: Function,
    options: OptionsT = { event: 'keydown' },
  ) {
    const { event } = options;

    const id: string = Math.random().toString(36).substr(2, 9);

    this.getFuncArray(event).push({
      id,
      key,
      func,
      options,
    });
  }

  unsub(subId: string) {
    const allArray = [this.keyupFuncs, this.keydownFuncs, this.keypressFuncs];

    for (let i = 0, len = allArray.length; i < len; i++) {
      allArray[i] = allArray[i].filter(({ id }) => id !== subId);
    }
  }
}

if (typeof window.__KEY_COMMANDER === 'undefined') {
  window.__KEY_COMMANDER = new KeyCommander();
}

module.exports = {
  subscribe: window.__KEY_COMMANDER.subscribe,
  unsub: window.__KEY_COMMANDER.unsub,
};
