const sharp = require('sharp');
const fs = require('fs');

if (!fs.existsSync('icons')) fs.mkdirSync('icons');

[16, 32, 48].forEach(s => {
  sharp('src/icon-dark.svg')
    .resize(s, s)
    .toFile(`icons/icon-dark-${s}.png`);
});

[16, 32, 48].forEach(s => {
  sharp('src/icon-light.svg')
    .resize(s, s)
    .toFile(`icons/icon-light-${s}.png`);
});
