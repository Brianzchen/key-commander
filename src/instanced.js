// @flow
import KeyCommander from '.';

if (typeof window.__KEY_COMMANDER === 'undefined') {
  window.__KEY_COMMANDER = new KeyCommander();
}

module.exports = {
  // $FlowExpectedError[method-unbinding]
  subscribe: window.__KEY_COMMANDER.subscribe,
  // $FlowExpectedError[method-unbinding]
  unsub: window.__KEY_COMMANDER.unsub,
  // $FlowExpectedError[method-unbinding]
  getList: window.__KEY_COMMANDER.getList,
};
