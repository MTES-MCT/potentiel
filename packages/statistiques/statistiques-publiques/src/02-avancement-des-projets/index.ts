import { computeNombreTotalProjetAyantTransmisAttestationConformité } from './nombreTotalProjetAyantTransmisAttestationConformité.statistic';
import { computePourcentageAttestationTéléchargée } from './pourcentageAttestationTéléchargée.statistic';
import { computePourcentageDCRDéposées } from './pourcentageDCRDéposées.statistic';
import { computePourcentagePTFDéposées } from './pourcentagePTFDéposées.statistic';

export const computeAvancementDesProjets = async () => {
  await computeNombreTotalProjetAyantTransmisAttestationConformité();
  await computePourcentageAttestationTéléchargée();
  await computePourcentageDCRDéposées();
  await computePourcentagePTFDéposées();
};
