import { computeNombreTotalProjetCRE4AyantTransmisAttestationConformité } from './nombreTotalProjetCRE4AyantTransmisAttestationConformité.statistic';
import { computeNombreTotalProjetPPE2AyantTransmisAttestationConformité } from './nombreTotalProjetPPE2AyantTransmisAttestationConformité.statistic';
import { computePourcentageProjetCRE4EnService } from './pourcentageProjetCRE4EnService.statistic';
import { computePourcentageProjetPPE2EnService } from './pourcentageProjetPPE2EnService.statistic';

export const computeParCycle = async () => {
  await computeNombreTotalProjetCRE4AyantTransmisAttestationConformité();
  await computeNombreTotalProjetPPE2AyantTransmisAttestationConformité();
  await computePourcentageProjetCRE4EnService();
  await computePourcentageProjetPPE2EnService();
};
