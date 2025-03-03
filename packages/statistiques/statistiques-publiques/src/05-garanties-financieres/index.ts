import { computeNombreTotalMainlevéeAccordée } from './nombreTotalMainlevéeAccordée.statistic';
import { computeTotalPuissanceProjetAvecMainlevéeAccordée } from './totalPuissanceProjetAvecMainlevéeAccordée.statistic';

export const computeGarantiesFinancieres = async () => {
  await computeNombreTotalMainlevéeAccordée();
  await computeTotalPuissanceProjetAvecMainlevéeAccordée();
};
