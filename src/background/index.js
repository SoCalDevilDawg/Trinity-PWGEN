/* globals browser */

import { generate } from '../lib/passwd';

const t = browser.i18n.getMessage;

browser.contextMenus.create({
  id: 'generatePassword-EEzgglgf',
  title: t('generatePassword'),
  contexts: ['password']
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'generatePassword-EEzgglgf') {
    browser.storage.sync.get('advancedData').then(res => {
      const { pool, length } = res.advancedData;
      const password = generate(pool, length);
      browser.tabs.sendMessage(tab.id, { password });
    });
  }
});
