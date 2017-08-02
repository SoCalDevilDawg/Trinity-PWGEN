/* globals browser */

const app = document.getElementById('app');

const pools = {
  alpha: 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ',
  num: 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789',
  sym: 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789!£$%^&*()_+-{}:@?[];#,.'
};
const poolNames = {
  alpha: 'Alpha',
  num: 'Alpha-numeric',
  sym: 'Alpha-numeric and symbols'
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
  const basic = createDiv({ innerHTML: '<b>Basic</b>' });
  app.appendChild(basic);
  for (const c of ['alpha', 'num', 'sym']) {
    basic.appendChild(createDiv({ innerText: poolNames[c], className: 'padtop' }));
    const count = document.createElement('div');
    for (let i = 8; i <= 32; i += 4) {
      const e = document.createElement('button');
      e.innerText = i;
      e.onclick = copyPassword(pools[c], i);
      e.title = `Click here to generate a password ${i} characters long, using ${poolNames[c]} characters`;
      count.appendChild(e);
    }
    basic.appendChild(count);
  }
})();

(() => {
  const advanced = createDiv({ innerHTML: '<b>Advanced</b>', className: 'padtop' });
  advanced.style.marginTop = '15px';
  app.appendChild(advanced);

  advanced.appendChild(createDiv({ innerText: 'Pool' }));
  const pool = document.createElement('textarea');
  pool.cols = 30;
  pool.rows = 3;
  pool.value = pools.sym;
  pool.title = 'The characters used to create the password, you can add or remove characters';
  advanced.appendChild(createDiv({ children: [pool] }));

  const rangeValue = createDiv({});
  advanced.appendChild(rangeValue);
  const range = document.createElement('input');
  range.type = 'range';
  range.value = 32;
  range.min = 8;
  range.max = 64;
  range.title = `The length of the generated password, you can click or drag to change.`;
  advanced.appendChild(createDiv({ children: [range] }));
  rangeValue.innerText = `Length (${range.value})`;

  advanced.appendChild(createDiv({ innerText: 'Output' }));
  const out = document.createElement('textarea');
  out.value = genPassword(pool.value, range.value);
  out.cols = 30;
  out.rows = 3;
  out.title = 'The generated password. You can edit the password before copying it';
  advanced.appendChild(createDiv({ children: [out] }));

  const copy = document.createElement('button');
  copy.innerText = 'Copy';
  copy.title = 'Copy the advanced generated password to the clipboard';
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
    rangeValue.innerText = `Length (${range.value})`;
    out.value = genPassword(pool.value, range.value);
  });

  pool.oninput = () => {
    out.value = genPassword(pool.value, range.value);
    browser.storage.sync.set({ advancedPool: pool.value });
  };
  range.oninput = () => {
    out.value = genPassword(pool.value, range.value);
    rangeValue.innerText = `Length (${range.value})`;
    browser.storage.sync.set({ advancedLength: range.value });
  };

  copy.onclick = () => {
    out.select();
    document.execCommand('Copy');
    window.close();
  };
})();
