/* globals browser */

/* eslint no-return-assign:off */
import React from 'react';
import copy from '../lib/copy';

const t = browser.i18n.getMessage;

const render = ({ pool, length, output }, { onPoolChange, onLengthChange, onOutputChange }) => (
  <div>
    <b>{t('advanced')}</b>
    <div>
      {t('pool')}
      <textarea value={pool} cols={30} rows={3} onChange={e => onPoolChange(e.target.value)} title={t('poolTitle')} />
    </div>
    <div>
      {t('length', length)}
      <input
        type="range"
        value={length}
        min={8}
        max={64}
        onInput={e => onLengthChange(e.target.value)}
        title={t('rangeTitle')}
      />
    </div>
    <div>
      {t('Output')}
      <textarea
        value={output}
        cols={30}
        rows={3}
        onChange={e => onOutputChange(e.target.value)}
        title={t('outTitle')}
      />
    </div>
    <div>
      <button
        onClick={() => {
          copy(output);
          window.close();
        }}
        title={t('copyTitle')}
      >
        {t('copy')}
      </button>
    </div>
  </div>
);

export default render;
