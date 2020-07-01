'use strict';

const fs = require('fs');
const path = require('path');
const arrify = require('arrify');
const has = require('lodash.has');
const readPkgUp = require('read-pkg-up');
const which = require('which');
const { cosmiconfigSync } = require('cosmiconfig');

const { packageJson: pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
});
const appDirectory = path.dirname(pkgPath);

function resolveNcScripts() {
  if (
    pkg.name === 'nc-scripts' || // this happens on install of husky within nc-scripts locally
    appDirectory.includes(path.join(__dirname, '..'))
  ) {
    return require.resolve('./').replace(process.cwd(), '.');
  }

  return resolveBin('nc-scripts');
}

function resolveBin(modName, { executable = modName, cwd = process.cwd() } = {}) {
  let pathFromWhich;

  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
    if (pathFromWhich && pathFromWhich.includes('.CMD')) return pathFromWhich;
  } catch (_error) {
    // ignore _error
  }

  try {
    const modPkgPath = require.resolve(`${modName}/package.json`);

    const modPkgDir = path.dirname(modPkgPath);

    const { bin } = require(modPkgPath);

    const binPath = typeof bin === 'string' ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);

    if (fullPathToBin === pathFromWhich) {
      return executable;
    }

    return fullPathToBin.replace(cwd, '.');
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }

    throw error;
  }
}

const fromRoot = (...p) => path.join(appDirectory, ...p);

const hasFile = (...p) => fs.existsSync(fromRoot(...p));

const hasPkgProp = (props) => arrify(props).some((prop) => has(pkg, prop));

const hasPkgSubProp = (pkgProp) => (props) =>
  hasPkgProp(arrify(props).map((p) => `${pkgProp}.${p}`));

const ifPkgSubProp = (pkgProp) => (props, t, f) => (hasPkgSubProp(pkgProp)(props) ? t : f);

const hasPeerDep = hasPkgSubProp('peerDependencies');
const hasDep = hasPkgSubProp('dependencies');
const hasDevDep = hasPkgSubProp('devDependencies');

const hasAnyDep = (args) => [hasDep, hasDevDep, hasPeerDep].some((fn) => fn(args));

const ifScript = ifPkgSubProp('scripts');
const hasTypescript = hasAnyDep('typescript') && hasFile('tsconfig.json');

function getConcurrentlyArgs(scripts, { killOthers = true } = {}) {
  const colors = [
    'bgBlue',
    'bgGreen',
    'bgMagenta',
    'bgCyan',
    'bgWhite',
    'bgRed',
    'bgBlack',
    'bgYellow',
  ];
  scripts = Object.entries(scripts).reduce((all, [name, script]) => {
    if (script) {
      all[name] = script;
    }

    return all;
  }, {});
  const prefixColors = Object.keys(scripts).reduce((pColors, _s, i) => pColors.concat([`${colors[i % colors.length]}.bold.reset`]), []).join(','); // prettier-ignore

  return [
    killOthers ? '--kill-others-on-fail' : null,
    '--prefix',
    '[{name}]',
    '--names',
    Object.keys(scripts).join(','),
    '--prefix-colors',
    prefixColors,
    ...Object.values(scripts).map((s) => JSON.stringify(s)), // stringify escapes quotes ✨
  ].filter(Boolean);
}

function hasLocalConfig(moduleName, searchOptions = {}) {
  const explorerSync = cosmiconfigSync(moduleName, searchOptions);
  const result = explorerSync.search(pkgPath);
  return result !== null;
}

module.exports = {
  getConcurrentlyArgs,
  hasFile,
  hasLocalConfig,
  hasPkgProp,
  ifScript,
  hasTypescript,
  pkg,
  resolveBin,
  resolveNcScripts,
};
