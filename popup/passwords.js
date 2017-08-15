/* globals browser */

const t = browser.i18n.getMessage;

const app = document.getElementById('app');

const pools = {
  alpha: 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ',
  num: 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789',
  sym: 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789!£$%^&*()_+-{}:@?[];#,.'
};
const poolNames = {
  alpha: t('Alpha'),
  num: t('Alpha-numeric'),
  sym: t('Alpha-numeric and symbols')
};

const createDiv = ({ innerHTML, innerText, children, className }) => {
  const a = document.createElement('div');
  if (innerText) a.innerText = innerText;
  if (innerHTML) a.innerHTML = innerHTML;
  if (className) a.className = className;
  if (children) children.forEach(i => a.appendChild(i));
  return a;
};

const genPassword = (pool, len) => {
  const array = new Uint32Array(len);
  window.crypto.getRandomValues(array);
  let password = '';
  for (let i = 0; i < array.length; i++) {
    password += pool[array[i] % pool.length];
  }
  return password;
};

const copyPassword = (pool, len) => () => {
  const a = document.createElement('input');
  a.value = genPassword(pool, len);
  app.appendChild(a);
  a.select();
  document.execCommand('Copy');
  app.removeChild(a);
  window.close();
};
(() => {
  const basic = createDiv({ innerHTML: `<b>${t('Basic')}</b>` });
  app.appendChild(basic);
  for (const c of ['alpha', 'num', 'sym']) {
    basic.appendChild(createDiv({ innerText: t(poolNames[c]), className: 'padtop' }));
    const count = document.createElement('div');
    for (let i = 8; i <= 32; i += 4) {
      const e = document.createElement('button');
      e.innerText = i;
      e.onclick = copyPassword(pools[c], i);
      e.title = t('buttonAction', [i, t(poolNames[c])]);
      count.appendChild(e);
    }
    basic.appendChild(count);
  }
})();

(() => {
  const advanced = createDiv({ innerHTML: `<b>${t('Advanced')}</b>`, className: 'padtop' });
  advanced.style.marginTop = '15px';
  app.appendChild(advanced);

  advanced.appendChild(createDiv({ innerText: t('Pool') }));
  const pool = document.createElement('textarea');
  pool.cols = 30;
  pool.rows = 3;
  pool.value = pools.sym;
  pool.title = t('poolTitle');
  advanced.appendChild(createDiv({ children: [pool] }));

  const rangeValue = createDiv({});
  advanced.appendChild(rangeValue);
  const range = document.createElement('input');
  range.type = 'range';
  range.value = 32;
  range.min = 8;
  range.max = 64;
  range.title = t('rangeTitle');
  advanced.appendChild(createDiv({ children: [range] }));
  rangeValue.innerText = t('length', [range.value]);

  advanced.appendChild(createDiv({ innerText: t('Output') }));
  const out = document.createElement('textarea');
  out.value = genPassword(pool.value, range.value);
  out.cols = 30;
  out.rows = 3;
  out.title = t('outTitle');
  advanced.appendChild(createDiv({ children: [out] }));

  const copy = document.createElement('button');
  copy.innerText = t('Copy');
  copy.title = t('copyTitle');
  advanced.appendChild(copy);

  browser.storage.sync.get('advancedPool').then(res => {
    let pl = res.advancedPool;
    if (!pl || pl.length === 0) {
      pl = pools.sym;
    }
    pool.value = pl;
  });
  browser.storage.sync.get('advancedLength').then(res => {
    range.value = res.advancedLength;
    rangeValue.innerText = t('length', [range.value]);
    out.value = genPassword(pool.value, range.value);
  });

  pool.oninput = () => {
    out.value = genPassword(pool.value, range.value);
    browser.storage.sync.set({ advancedPool: pool.value });
  };
  range.oninput = () => {
    out.value = genPassword(pool.value, range.value);
    rangeValue.innerText = t('length', [range.value]);
    browser.storage.sync.set({ advancedLength: range.value });
  };

  copy.onclick = () => {
    out.select();
    document.execCommand('Copy');
    window.close();
  };
})();
