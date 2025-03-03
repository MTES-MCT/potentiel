import { computeNombreTotalDCRDéposées } from './nombreTotalDCRDéposées.statistic';
import { computeNombreTotalProjetEnService } from './nombreTotalProjetEnService.statistic';
import { computePourcentageProjetAvecDCREtPTF } from './pourcentageProjetAvecDCREtPTF.statistic';
import { computePourcentageProjetEnService } from './pourcentageProjetEnService.statistic';
import { computePuissanceTotaleMiseEnService } from './puissanceTotaleMiseEnService.stastistic';

export const computeMiseEnService = async () => {
  await computeNombreTotalDCRDéposées();
  await computeNombreTotalProjetEnService();
  await computePourcentageProjetAvecDCREtPTF();
  await computePourcentageProjetEnService();
  await computePuissanceTotaleMiseEnService();
};
