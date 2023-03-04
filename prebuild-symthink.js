const { version } = require('./package.json');
const { resolve } = require('path');
const { writeFileSync } = require('fs-extra');

const buildInfo = {};
 
buildInfo.version = version;
buildInfo.timestamp = Date.now();
 
const file = resolve(__dirname, 'apps/symthink/src', 'environment', 'env.ts');
 
const contents = 'export const buildInfo = ' +
   JSON.stringify(buildInfo, null, 2)
     .replace(/"([^"]+)":/g, '$1:')
     .replace(/: "([^"]+)"/g, ': \'$1\'') + `;
`;
 
writeFileSync(file, contents, { encoding: 'utf-8' });
