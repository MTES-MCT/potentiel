import { computeNombreTotalProjetAchevé } from './nombreTotalProjetAchevé.js';
import { computePourcentageAttestationTéléchargée } from './pourcentageAttestationTéléchargée.statistic.js';
import { computePourcentageProjetAchevé } from './pourcentageProjetAchevé.statistic.js';

export const computeAvancementDesProjets = async () => {
  await computeNombreTotalProjetAchevé();
  await computeNombreTotalProjetAchevé('PPE2');
  await computeNombreTotalProjetAchevé('CRE4');
  await computePourcentageProjetAchevé();
  await computePourcentageProjetAchevé('PPE2');
  await computePourcentageProjetAchevé('CRE4');
  await computePourcentageAttestationTéléchargée();
};
