const fs = require('fs');
const targetFile = 'dist/main.js';
let contents = fs.readFileSync(targetFile, {encoding: 'utf8'});

contents = contents.replace(/export { Widget };/g, 'return Widget;');
fs.writeFileSync(targetFile, contents);
