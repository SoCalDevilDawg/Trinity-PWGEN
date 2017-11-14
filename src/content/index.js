/* globals browser */

const copy = require('../lib/copy');

browser.runtime.onMessage.addListener(m => {
  console.log('ON MESSAGE', document.activeElement);
  document.activeElement.value = m.password;
  copy(m.password);
});
