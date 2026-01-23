import { computeNombreTotalProjetAyantTransmisAttestationConformitéParCycle } from './computeNombreTotalProjetAyantTransmisAttestationConformitéParCycle.js';
import { computePourcentageProjetEnServiceParCycle } from './computePourcentageProjetEnServiceParCycle.statistic.js';

export const computeParCycle = async () => {
  await computeNombreTotalProjetAyantTransmisAttestationConformitéParCycle('CRE4');
  await computeNombreTotalProjetAyantTransmisAttestationConformitéParCycle('PPE2');
  await computePourcentageProjetEnServiceParCycle('CRE4');
  await computePourcentageProjetEnServiceParCycle('PPE2');
};
