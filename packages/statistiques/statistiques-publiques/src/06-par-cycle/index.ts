import { computeNombreTotalProjetAchevé } from './computeNombreTotalProjetAchevé.js';
import { computePourcentageProjetEnServiceParCycle } from './computePourcentageProjetEnServiceParCycle.statistic.js';

export const computeParCycle = async () => {
  await computeNombreTotalProjetAchevé('CRE4');
  await computeNombreTotalProjetAchevé('PPE2');
  await computePourcentageProjetEnServiceParCycle('CRE4');
  await computePourcentageProjetEnServiceParCycle('PPE2');
};
