/* globals browser */

import copy from '../lib/copy';

browser.runtime.onMessage.addListener(m => {
  document.activeElement.value = m.password;
  copy(m.password);
});

console.log('content script loaded');
