'use strict';

const conventionalRecommendedBump = require(`conventional-recommended-bump`);
const spawn = require('cross-spawn');
const { resolveBin } = require('../utils');

conventionalRecommendedBump(
  {
    whatBump: (commits) => {
      const noReleaseComments = commits.filter(
        (commit) => !(commit.type === 'chore' && commit.scope === 'release'),
      );

      if (noReleaseComments.length === 0) {
        return {
          level: 3,
          reason: 'There are no relevant changes, so no new version is released.',
        };
      }

      return {};
    },
  },
  (error, recommendation) => {
    if (error) throw error;

    if (recommendation.level === 3) {
      console.log(recommendation.reason);
      process.exit(0);
    }

    const args = process.argv.slice(2);
    const result = spawn.sync(resolveBin('standard-version'), args, {
      stdio: 'inherit',
    });
    process.exit(result.status);
  },
);
