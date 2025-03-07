import { computeNombreTotalProjetAyantTransmisAttestationConformité } from './nombreTotalProjetAyantTransmisAttestationConformité.statistic';
import { computePourcentageAttestationTéléchargée } from './pourcentageAttestationTéléchargée.statistic';
import { computePourcentageProjetAyantTransmisAttestationConformité } from './pourcentageProjetAyantTransmisAttestationConformité.statistic';

export const computeAvancementDesProjets = async () => {
  await computeNombreTotalProjetAyantTransmisAttestationConformité();
  await computePourcentageProjetAyantTransmisAttestationConformité();
  await computePourcentageAttestationTéléchargée();
};
