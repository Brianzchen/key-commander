// @flow
import KeyCommander from '.';

if (typeof window.__KEY_COMMANDER === 'undefined') {
  window.__KEY_COMMANDER = new KeyCommander();
}

module.exports = {
  subscribe: window.__KEY_COMMANDER.subscribe,
  unsub: window.__KEY_COMMANDER.unsub,
  getList: window.__KEY_COMMANDER.getList,
};
