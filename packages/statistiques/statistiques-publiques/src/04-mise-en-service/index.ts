import { computeNombreTotalProjetEnService } from './nombreTotalProjetEnService.statistic';
import { computeNombreTotalPTFDéposées } from './nombreTotalPTFDéposées.statistic';
import { computeNombreTotalRéférencesRaccordement } from './nombreTotalRéférencesRaccordement.statistic';
import { computepourcentageProjetAvecDCRQuiOntUnePTF } from './pourcentageProjetAvecDCRQuiOntUnePTF.statistic';
import { computePourcentageProjetEnService } from './pourcentageProjetEnService.statistic';
import { computePourcentagePTFDéposées } from './pourcentagePTFDéposées.statistic';
import { computePourcentageRéférencesRaccordement } from './pourcentageRéférencesRaccordement.statistic';
import { computePuissanceTotaleMiseEnService } from './puissanceTotaleMiseEnService.stastistic';

export const computeMiseEnService = async () => {
  await computeNombreTotalRéférencesRaccordement();
  await computeNombreTotalPTFDéposées();
  await computeNombreTotalProjetEnService();
  await computepourcentageProjetAvecDCRQuiOntUnePTF();
  await computePourcentageProjetEnService();
  await computePuissanceTotaleMiseEnService();
  await computePourcentagePTFDéposées();
  await computePourcentageRéférencesRaccordement();
};
