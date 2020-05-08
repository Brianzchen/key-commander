// @flow
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import kc from '../../index.dist';

import ShowHide from './ShowHide';

const App = () => {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    kc.subscribe('Escape', () => {
      console.log('you pressed escape');
    });
  }, []);

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

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
