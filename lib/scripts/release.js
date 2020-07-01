'use strict';

const standardVersion = require('standard-version');
const conventionalRecommendedBump = require(`conventional-recommended-bump`);

conventionalRecommendedBump(
  {
    whatBump: (commits, options) => {
      const noReleaseComments = commits.filter(
        (commit) => !(commit.type === 'chore' && commit.scope === 'release'),
      );

      if (noReleaseComments.length === 0) {
        return {
          level: 3,
          reason: 'There are no relevant changes, so no new version is released.',
        };
      }

      return options.whatBump(commits, options);
    },
  },
  (error, recommendation) => {
    if (error) throw error;

    console.log(recommendation.reason);

    if (recommendation.releaseType) {
      standardVersion().catch((err) => {
        throw err;
      });
    }
  },
);
