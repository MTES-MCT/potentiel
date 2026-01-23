import { computeNombreTotalProjetAyantTransmisAttestationConformité } from './nombreTotalProjetAyantTransmisAttestationConformité.statistic.js';
import { computePourcentageAttestationTéléchargée } from './pourcentageAttestationTéléchargée.statistic.js';
import { computePourcentageProjetAyantTransmisAttestationConformité } from './pourcentageProjetAyantTransmisAttestationConformité.statistic.js';

export const computeAvancementDesProjets = async () => {
  await computeNombreTotalProjetAyantTransmisAttestationConformité();
  await computePourcentageProjetAyantTransmisAttestationConformité();
  await computePourcentageAttestationTéléchargée();
};
