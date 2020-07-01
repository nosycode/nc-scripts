'use strict';

const { resolveNcScripts } = require('../utils');

const ncScripts = resolveNcScripts();
module.exports = {
  hooks: {
    'pre-commit': `${ncScripts} pre-commit`,
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
};
