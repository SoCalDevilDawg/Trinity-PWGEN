/* globals browser */
import React from 'react';
import { pools, generate } from '../lib/passwd';
import copy from '../lib/copy';

const t = browser.i18n.getMessage;

const render = () => {
  const basic = [];
  for (const c of ['alpha', 'num', 'sym']) {
    const buttons = [];
    for (let i = 8; i <= 32; i += 4) {
      buttons.push(
        <button onClick={() => copy(generate(pools[c], i))} title={t('buttonAction', [i, t(c)])}>
          {i}
        </button>
      );
    }
    basic.push(
      <div>
        {t(c)}
        <div>
          {buttons}
        </div>
      </div>
    );
  }

  return (
    <div>
      <b>
        {t('basic')}
      </b>
      {basic}
    </div>
  );
};

export default render;
