import { computeProjetLauréatParDépartement } from './projetLauréatParDépartement.statistic.js';

export const computeCarte = async () => {
  await computeProjetLauréatParDépartement();
};
