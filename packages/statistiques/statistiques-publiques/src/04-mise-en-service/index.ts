import { computeNombreTotalDCRDéposées } from './nombreTotalDCRDéposées.statistic';
import { computeNombreTotalProjetEnService } from './nombreTotalProjetEnService.statistic';
import { computePourcentageDCRDéposées } from './pourcentageDCRDéposées.statistic';
import { computePourcentageProjetAvecDCREtPTF } from './pourcentageProjetAvecDCREtPTF.statistic';
import { computePourcentageProjetEnService } from './pourcentageProjetEnService.statistic';
import { computePourcentagePTFDéposées } from './pourcentagePTFDéposées.statistic';
import { computePuissanceTotaleMiseEnService } from './puissanceTotaleMiseEnService.stastistic';

export const computeMiseEnService = async () => {
  await computeNombreTotalDCRDéposées();
  await computeNombreTotalProjetEnService();
  await computePourcentageProjetAvecDCREtPTF();
  await computePourcentageProjetEnService();
  await computePuissanceTotaleMiseEnService();
  await computePourcentageDCRDéposées();
  await computePourcentagePTFDéposées();
};
