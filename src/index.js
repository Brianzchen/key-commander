// @flow
type KeyT = 'keyup' | 'keydown' | 'keypress';
type ModifierT = 'alt' | 'ctrl' | 'meta' | 'shift';

type OptionsT = {|
  /**
   * At what stage of the user input you would like the function called
   *
   * default: keydown
   */
  event?: KeyT,
  /**
   * If you want the function called only when one or more modifiers are active
   * You may experience issues with alt/meta modifiers depending on browsers as
   * they may be attached to other browser functionality.
   *
   * Can also pass `'none'` if you want to specifically trigger only if no modifiers are pressed
   *
   * default: void
   */
  modifier?: 'none' | ModifierT | Array<ModifierT>,
  /**
   * If you want the function called multiple times if the user holds down a particular key
   *
   * default: false
   */
  onRepeat?: boolean,
|};

type EventFuncT = {|
  id: string,
  key: string,
  func: (
    event: KeyboardEvent,
    {|
      /**
       * Use this to determine if the currently focused element
       * when then event occurs has a tab index such as an input
       * where you may not want to trigger your function
       */
      onTabElement: boolean,
    |},
  ) => void,
  options: OptionsT,
|}

type EventFuncListT = Array<EventFuncT>

module.exports = class KeyCommander {
  keyupFuncs: EventFuncListT;

  keydownFuncs: EventFuncListT;

  keypressFuncs: EventFuncListT;

  constructor() {
    this.keyupFuncs = [];
    this.keydownFuncs = [];
    this.keypressFuncs = [];

    // $FlowExpectedError[method-unbinding]
    (this: any).listener = this.listener.bind(this);
    // $FlowExpectedError[method-unbinding]
    (this: any).subscribe = this.subscribe.bind(this);
    // $FlowExpectedError[method-unbinding]
    (this: any).unsub = this.unsub.bind(this);
    // $FlowExpectedError[method-unbinding]
    (this: any).getList = this.getList.bind(this);

    window.addEventListener('keyup', (event) => this.listener(event, 'keyup'));
    window.addEventListener('keydown', (event) => this.listener(event, 'keydown'));
    window.addEventListener('keypress', (event) => this.listener(event, 'keypress'));
  }

  getFuncArray(event: KeyT): EventFuncListT {
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
          } else if (
            modifier === 'none'
            && !event.altKey
            && !event.ctrlKey
            && !event.metaKey
            && !event.shiftKey) {
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
          const isAllModifiersSelected = conditions.every((value) => value);
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
  ): string {
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

  getList(): Array<EventFuncT> {
    return [...this.keydownFuncs, ...this.keyupFuncs, ...this.keypressFuncs];
  }
};
