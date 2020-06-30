'use strict';

const { resolveWmsScripts, resolveBin } = require('../utils');

const wmsScripts = resolveWmsScripts();
const doctoc = resolveBin('doctoc');
module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)': [`${wmsScripts} format`],
};
