import { LauréatDependencies, setupLauréat } from './lauréat/lauréat.setup';

export type ProjetDependencies = LauréatDependencies;

export const setupProjet = async (dependencies: ProjetDependencies) => {
  // Commands
  return [...(await setupLauréat(dependencies))];
};
