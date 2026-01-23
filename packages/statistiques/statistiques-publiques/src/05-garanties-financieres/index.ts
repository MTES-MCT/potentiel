import { computeNombreTotalMainlevéeAccordée } from './nombreTotalMainlevéeAccordée.statistic.js';
import { computeTotalPuissanceProjetAvecMainlevéeAccordée } from './totalPuissanceProjetAvecMainlevéeAccordée.statistic.js';

export const computeGarantiesFinancieres = async () => {
  await computeNombreTotalMainlevéeAccordée();
  await computeTotalPuissanceProjetAvecMainlevéeAccordée();
};
