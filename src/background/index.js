/* globals browser */

import { pools, generate } from '../lib/passwd';

const t = browser.i18n.getMessage;

let advancedData = {
  pool: pools.sym,
  length: 32,
  output: ''
};

browser.contextMenus.create({
  id: 'generatePassword-EEzgglgf',
  title: t('generatePassword'),
  contexts: ['password']
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'generatePassword-EEzgglgf') {
    browser.storage.sync.get('advancedData').then(res => {
      advancedData = res.advancedData ? res.advancedData : advancedData;
      const { pool, length } = advancedData;
      const password = generate(pool, length);
      browser.tabs.sendMessage(tab.id, { password });
    });
  }
});
