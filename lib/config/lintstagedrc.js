'use strict';

const { resolveNcScripts, resolveBin } = require('../utils');

const ncScripts = resolveNcScripts();
const doctoc = resolveBin('doctoc');
module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)': [`${ncScripts} format`],
};
