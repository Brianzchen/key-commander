// @flow
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import kc from '../../instanced';

import ShowHide from './ShowHide';

const App = () => {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    // basic with miscasing
    const escape = kc.subscribe('Escape', () => {
      console.log('you pressed escape');
    });

    // keyup with single modifier
    const q = kc.subscribe('Q', () => {
      console.log('you pressed q with shift');
    }, { event: 'keyup', modifier: 'shift' });

    // keydown with multiple modifiers
    const w = kc.subscribe('w', () => {
      console.log('you pressed w with shift + ctrl');
    }, { modifier: ['shift', 'ctrl'] });

    // keydown with repeat on
    const e = kc.subscribe('e', () => {
      console.log('you pressed e and it repeats');
    }, { onRepeat: true });

    // unsub all the above
    kc.subscribe('enter', () => {
      kc.unsub(escape);
      kc.unsub(q);
      kc.unsub(w);
      kc.unsub(e);
    });
  }, []);

  console.log(kc.getList());

  return (
    <div>
      test
      <button
        type="button"
        onClick={() => {
          setShowing((p) => !p);
        }}
      >
        {showing ? 'hide' : 'show'}
      </button>
      {showing && <ShowHide />}
    </div>
  );
};

const ele = document.getElementById('root')

if (ele) {
  ReactDOM.render(
    <App />,
    ele,
  );
}
