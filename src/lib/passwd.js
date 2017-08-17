const pools = {
  alpha: 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ',
  num: 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789',
  sym: 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789!£$%^&*()_+-{}:@?[];#,.'
};

const generate = (pool, len) => {
  const array = new Uint32Array(len);
  window.crypto.getRandomValues(array);
  let password = '';
  for (let i = 0; i < array.length; i++) {
    password += pool[array[i] % pool.length];
  }
  return password;
};

module.exports = { pools, generate };
