import {
  RecoursCommandDependencies,
  RecoursQueryDependencies,
  registerRecoursQueries,
  registerRecoursUseCases,
} from './recours/recours.register';

export type EliminéQueryDependencies = RecoursQueryDependencies;
export type EliminéCommandDependencies = RecoursCommandDependencies;

export const registerEliminéUseCases = (dependencies: EliminéCommandDependencies) => {
  registerRecoursUseCases(dependencies);
};

export const registerEliminéQueries = (dependencies: EliminéQueryDependencies) => {
  registerRecoursQueries(dependencies);
};
