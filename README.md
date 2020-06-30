# nc-scripts

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```sh
npm i -D https://github.com/nosycode/nc-scripts.git && \
echo "module.exports = require('nc-scripts/prettier');" > .prettierrc.js && \
echo "node_modules/" > .prettierignore && \
echo "module.exports = require('nc-scripts/husky');" > .huskyrc.js
echo "module.exports = require('nc-scripts/commitlint');;" > .commitlintrc.js
```

```json
{
  "scripts": {
    "validate": "nc-scripts validate lint,test"
  }
}
```
