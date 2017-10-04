module.exports = text => {
  const a = document.createElement('input');
  a.value = text;
  a.style = { display: 'none' };
  document.body.appendChild(a);
  a.select();
  document.execCommand('Copy');
  document.body.removeChild(a);
};
