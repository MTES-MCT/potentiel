import { computeNombreTotalProjetEnService } from './nombreTotalProjetEnService.statistic.js';
import { computeNombreTotalPTFDéposées } from './nombreTotalPTFDéposées.statistic.js';
import { computeNombreTotalRéférencesRaccordement } from './nombreTotalRéférencesRaccordement.statistic.js';
import { computepourcentageProjetAvecDCRQuiOntUnePTF } from './pourcentageProjetAvecDCRQuiOntUnePTF.statistic.js';
import { computePourcentageProjetEnService } from './pourcentageProjetEnService.statistic.js';
import { computePourcentagePTFDéposées } from './pourcentagePTFDéposées.statistic.js';
import { computePourcentageRéférencesRaccordement } from './pourcentageRéférencesRaccordement.statistic.js';
import { computePuissanceTotaleMiseEnService } from './puissanceTotaleMiseEnService.stastistic.js';

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
