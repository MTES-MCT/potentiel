import { computeNombreTotalProjetAchevé } from './nombreTotalProjetAchevé.js';
import { computePourcentageProjetEnService } from './pourcentageProjetEnService.statistic.js';

export const computeParCycle = async () => {
  await computeNombreTotalProjetAchevé('CRE4');
  await computeNombreTotalProjetAchevé('PPE2');
  await computePourcentageProjetEnService('CRE4');
  await computePourcentageProjetEnService('PPE2');
};
