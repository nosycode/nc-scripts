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

      return {};
    },
  },
  (error, recommendation) => {
    if (error) throw error;

    if (recommendation.level === 3) {
      console.log(recommendation.reason);
    } else {
      standardVersion({}).catch((err) => {
        throw err;
      });
    }
  },
);
