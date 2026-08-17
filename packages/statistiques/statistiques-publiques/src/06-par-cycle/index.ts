import { computeNombreTotalProjetAchevé } from './computeNombreTotalProjetAchevé.js';
import { computePourcentageProjetEnService } from './computePourcentageProjetEnService.statistic.js';

export const computeParCycle = async () => {
  await computeNombreTotalProjetAchevé('CRE4');
  await computeNombreTotalProjetAchevé('PPE2');
  await computePourcentageProjetEnService('CRE4');
  await computePourcentageProjetEnService('PPE2');
};
