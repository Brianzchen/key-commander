// @flow
import React, { useEffect } from 'react';

import kc from '../../index';

// Tests sub/unsub
const ShowHide = () => {
  useEffect(() => {
    const id = kc.subscribe('b', (event, { onTabElement }) => {
      if (!onTabElement) {
        console.log('You pressed b!');
      }
    });

    return () => {
      kc.unsub(id);
    };
  }, []);

  return (
    <div>
      {'When you can see this pressing \'b\' will trigger a log'}
    </div>
  );
};

export default ShowHide;
