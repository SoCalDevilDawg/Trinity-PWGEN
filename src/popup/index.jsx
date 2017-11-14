/* global browser */
import React from 'react';
import ReactDOM from 'react-dom';
import basic from './basic';
import advanced from './advanced';
import { pools, generate } from '../lib/passwd';

let flip;
let advancedData = {
  pool: pools.sym,
  length: 32,
  output: ''
};

const regen = () => {
  advancedData.output = generate(advancedData.pool, advancedData.length);
  flip();
};

const save = () => {
  browser.storage.sync.set({ advancedData });
  regen();
};

const advancedFuncs = {
  onPoolChange: a => {
    advancedData.pool = a.length > 0 ? a : pools.sym;
    save();
  },
  onLengthChange: a => {
    advancedData.length = a;
    save();
  },
  onOutputChange: a => {
    advancedData.output = a;
    flip();
  }
};

flip = () => {
  ReactDOM.render(
    <div>
      {basic()}
      <div className="padtop" />
      {advanced(advancedData, advancedFuncs)}
    </div>,
    document.getElementById('app')
  );
};

browser.storage.sync.get('advancedData').then(res => {
  advancedData = res.advancedData ? res.advancedData : advancedData;
  regen();
});

flip();
