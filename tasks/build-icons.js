const sharp = require('sharp');
const fs = require('fs');

if (!fs.existsSync('icons')) fs.mkdirSync('icons');

[16, 32, 48].forEach(s => {
  sharp('src/icon.svg')
    .resize(s, s)
    .toFile(`icons/icon-${s}.png`);
});
