import { Subscribe } from '@potentiel/core-domain';
import { CandidatureDependencies, setupCandidatureViews } from './candidature/candidature.setup';
import { LauréatDependencies, setupLauréatViews } from './lauréat/lauréat.setup';

// Setup
export type ProjetDependencies = { subscribe: Subscribe } & CandidatureDependencies &
  LauréatDependencies;

export const setupProjetViews = async (dependencies: ProjetDependencies) => {
  await setupCandidatureViews(dependencies);

  return [...(await setupLauréatViews(dependencies))];
};
