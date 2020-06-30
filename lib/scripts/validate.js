'use strict';

const spawn = require('cross-spawn');
const { resolveBin, ifScript, getConcurrentlyArgs } = require('../utils');

const validateScripts = process.argv[2];

const useDefaultScripts = typeof validateScripts !== 'string';

const scripts = useDefaultScripts
  ? {
      typecheck: ifScript('typecheck', 'npm run typecheck --silent'),
    }
  : validateScripts.split(',').reduce((scriptsToRun, name) => {
      scriptsToRun[name] = `npm run ${name} --silent`;
      return scriptsToRun;
    }, {});

const scriptCount = Object.values(scripts).filter(Boolean).length;

if (scriptCount > 0) {
  const result = spawn.sync(resolveBin('concurrently'), getConcurrentlyArgs(scripts), {
    stdio: 'inherit',
  });

  process.exit(result.status);
} else {
  process.exit(0);
}
