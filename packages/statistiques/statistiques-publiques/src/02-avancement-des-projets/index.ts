import { computeNombreTotalProjetAchevé } from '../06-par-cycle/computeNombreTotalProjetAchevé.js';
import { computePourcentageAttestationTéléchargée } from './pourcentageAttestationTéléchargée.statistic.js';
import { computePourcentageProjetAyantTransmisAttestationConformité } from './pourcentageProjetAyantTransmisAttestationConformité.statistic.js';

export const computeAvancementDesProjets = async () => {
  await computeNombreTotalProjetAchevé();
  await computePourcentageProjetAyantTransmisAttestationConformité();
  await computePourcentageAttestationTéléchargée();
};
