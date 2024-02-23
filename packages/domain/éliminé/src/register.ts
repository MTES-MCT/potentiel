import {
  RecoursCommandDependencies,
  RecoursQueryDependencies,
  registerRecoursQueries,
  registerRecoursUseCases,
} from './recours/recours.register';

export type LauréatQueryDependencies = RecoursQueryDependencies;
export type LauréatCommandDependencies = RecoursCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerRecoursUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerRecoursQueries(dependencies);
};
