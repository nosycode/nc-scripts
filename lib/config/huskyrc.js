'use strict';

const { resolveWmsScripts } = require('../utils');

const wmsScripts = resolveWmsScripts();
module.exports = {
  hooks: {
    'pre-commit': `${wmsScripts} pre-commit`,
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
};
