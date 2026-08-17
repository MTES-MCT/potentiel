import { computeNombreTotalProjetAchevé } from '../06-par-cycle/nombreTotalProjetAchevé.js';
import { computePourcentageAttestationTéléchargée } from './pourcentageAttestationTéléchargée.statistic.js';
import { computePourcentageProjetAchevé } from './pourcentageProjetAchevé.statistic.js';

export const computeAvancementDesProjets = async () => {
  await computeNombreTotalProjetAchevé();
  await computePourcentageProjetAchevé();
  await computePourcentageAttestationTéléchargée();
};
