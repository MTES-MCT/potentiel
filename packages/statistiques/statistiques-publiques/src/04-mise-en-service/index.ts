import { computeNombreTotalProjetEnService } from './nombreTotalProjetEnService.statistic.js';
import { computeNombreTotalProjetPPE2AvecDCRDéposée } from './nombreTotalProjetPPE2AvecDCRDéposée.statistic.js';
import { computeNombreTotalProjetPPE2AvecDossierRaccordementComplet } from './nombreTotalProjetPPE2AvecDossierRaccordementComplet.statistic.js';
import { computeNombreTotalRéférencesRaccordement } from './nombreTotalRéférencesRaccordement.statistic.js';
import { computePourcentageProjetEnService } from './pourcentageProjetEnService.statistic.js';
import { computePourcentageProjetPPE2AvecDCRDéposée } from './pourcentageProjetPPE2AvecDCRDéposée.js';
import { computePourcentageProjetPPE2AvecDossierRaccordementComplet } from './pourcentageProjetPPE2AvecDossierRaccordementComplet.statistic.js';
import { computePourcentageRéférencesRaccordement } from './pourcentageRéférencesRaccordement.statistic.js';
import { computePuissanceTotaleMiseEnService } from './puissanceTotaleMiseEnService.stastistic.js';

export const computeMiseEnService = async () => {
  await computeNombreTotalRéférencesRaccordement();
  await computeNombreTotalProjetPPE2AvecDCRDéposée();
  await computeNombreTotalProjetEnService();
  await computeNombreTotalProjetPPE2AvecDossierRaccordementComplet();
  await computePourcentageProjetEnService();
  await computePuissanceTotaleMiseEnService();
  await computePourcentageProjetPPE2AvecDCRDéposée();
  await computePourcentageRéférencesRaccordement();
  await computePourcentageProjetPPE2AvecDossierRaccordementComplet();
};
