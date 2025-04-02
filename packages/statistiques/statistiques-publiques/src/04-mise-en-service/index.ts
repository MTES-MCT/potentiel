import { computeNombreTotalDCRDéposées } from './nombreTotalDCRDéposées.statistic';
import { computeNombreTotalProjetEnService } from './nombreTotalProjetEnService.statistic';
import { computePourcentageDCRDéposées } from './pourcentageDCRDéposées.statistic';
import { computepourcentageProjetAvecDCRQuiOntUnePTF } from './pourcentageProjetAvecDCRQuiOntUnePTF.statistic';
import { computePourcentageProjetEnService } from './pourcentageProjetEnService.statistic';
import { computePourcentagePTFDéposées } from './pourcentagePTFDéposées.statistic';
import { computePuissanceTotaleMiseEnService } from './puissanceTotaleMiseEnService.stastistic';

export const computeMiseEnService = async () => {
  await computeNombreTotalDCRDéposées();
  await computeNombreTotalProjetEnService();
  await computepourcentageProjetAvecDCRQuiOntUnePTF();
  await computePourcentageProjetEnService();
  await computePuissanceTotaleMiseEnService();
  await computePourcentageDCRDéposées();
  await computePourcentagePTFDéposées();
};
