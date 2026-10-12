import {
  type ListerNouveautésDependencies,
  registerListerNouveautésQuery,
} from './lister/listerNouveautés.query.js';

type NouveautésQueryDependencies = ListerNouveautésDependencies;

export const registerNouveautésQueries = (dependencies: NouveautésQueryDependencies) => {
  registerListerNouveautésQuery(dependencies);
};
