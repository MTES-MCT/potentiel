import { computeProjetLauréatParDépartement } from './projetLauréatParDépartement.statistic';

export const computeCarte = async () => {
  await computeProjetLauréatParDépartement();
};
