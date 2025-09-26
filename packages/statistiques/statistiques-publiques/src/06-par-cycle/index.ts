import { computeNombreTotalProjetAyantTransmisAttestationConformitéParCycle } from './computeNombreTotalProjetAyantTransmisAttestationConformitéParCycle';
import { computePourcentageProjetEnServiceParCycle } from './computePourcentageProjetEnServiceParCycle.statistic';

export const computeParCycle = async () => {
  await computeNombreTotalProjetAyantTransmisAttestationConformitéParCycle('CRE4');
  await computeNombreTotalProjetAyantTransmisAttestationConformitéParCycle('PPE2');
  await computePourcentageProjetEnServiceParCycle('CRE4');
  await computePourcentageProjetEnServiceParCycle('PPE2');
};
