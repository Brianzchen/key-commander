// @flow
type KeyT = 'keyup' | 'keydown' | 'keypress';
type ModifierT = 'alt' | 'ctrl' | 'meta' | 'shift';

type OptionsT = {
  event?: KeyT,
  modifier?: ModifierT | Array<ModifierT>,
  onRepeat?: boolean,
};

type EventFuncT = {
  id: string,
  key: string,
  func: (
    event: KeyboardEvent,
    {
      onTabElement: boolean,
    },
  ) => void,
  options: OptionsT,
}

type EventFuncListT = Array<EventFuncT>

module.exports = class KeyCommander {
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
    (this: any).getList = this.getList.bind(this);

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

      if (event.repeat && !funcObj.options.onRepeat) continue;

      const other = {
        onTabElement: document.activeElement?.tabIndex !== -1,
      };

      if (funcObj.key.toLowerCase() === event.key.toLowerCase()) {
        const { modifier } = funcObj.options;
        if (typeof modifier === 'string') {
          if (modifier === 'alt' && event.altKey) {
            funcObj.func(event, other);
          } else if (modifier === 'ctrl' && event.ctrlKey) {
            funcObj.func(event, other);
          } else if (modifier === 'meta' && event.metaKey) {
            funcObj.func(event, other);
          } else if (modifier === 'shift' && event.shiftKey) {
            funcObj.func(event, other);
          }
        } else if (Array.isArray(modifier)) {
          const conditions: Array<boolean> = modifier.map((o) => {
            if (o === 'alt') return event.altKey;
            if (o === 'ctrl') return event.ctrlKey;
            if (o === 'meta') return event.metaKey;
            if (o === 'shift') return event.shiftKey;
            return false;
          });
          const isAllModifiersSelected = conditions.reduce((prev, curr) => {
            if (prev) {
              return curr;
            }
            return prev;
          }, true);
          if (isAllModifiersSelected) {
            funcObj.func(event, other);
          }
        } else {
          funcObj.func(event, other);
        }
      }
    }
  }

  subscribe(
    key: string,
    func: Function,
    options?: OptionsT = { event: 'keydown', onRepeat: false },
  ) {
    const { event = 'keydown' } = options;

    const id: string = Math.random().toString(36).substr(2, 9);

    this.getFuncArray(event).push({
      id,
      key,
      func,
      options,
    });

    return id;
  }

  unsub(subId: string) {
    const filtering = (arr) => arr.filter(({ id }) => id !== subId);
    this.keyupFuncs = filtering(this.keyupFuncs);
    this.keydownFuncs = filtering(this.keydownFuncs);
    this.keypressFuncs = filtering(this.keypressFuncs);
  }

  getList() {
    return [...this.keydownFuncs, ...this.keyupFuncs, ...this.keypressFuncs];
  }
};
