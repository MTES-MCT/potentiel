import { computePourcentageProjetEnService } from '../06-par-cycle/computePourcentageProjetEnService.statistic.js';
import { computeNombreTotalProjetAvecDCRDéposée } from './nombreTotalProjetAvecDCRDéposée.statistic.js';
import { computeNombreTotalProjetAvecDossierRaccordementComplet } from './nombreTotalProjetAvecDossierRaccordementComplet.statistic.js';
import { computeNombreTotalProjetEnService } from './nombreTotalProjetEnService.statistic.js';
import { computeNombreTotalRéférencesRaccordement } from './nombreTotalRéférencesRaccordement.statistic.js';
import { computePourcentageProjetAvecDCRDéposée } from './pourcentageProjetAvecDCRDéposée.js';
import { computePourcentageProjetAvecDossierRaccordementComplet } from './pourcentageProjetAvecDossierRaccordementComplet.statistic.js';
import { computePourcentageRéférencesRaccordement } from './pourcentageRéférencesRaccordement.statistic.js';
import { computePuissanceTotaleMiseEnService } from './puissanceTotaleMiseEnService.stastistic.js';

export const computeMiseEnService = async () => {
  await computeNombreTotalRéférencesRaccordement();
  await computeNombreTotalProjetAvecDCRDéposée('PPE2');
  await computeNombreTotalProjetEnService();
  await computeNombreTotalProjetAvecDossierRaccordementComplet('PPE2');
  await computePourcentageProjetEnService();
  await computePuissanceTotaleMiseEnService();
  await computePourcentageProjetAvecDCRDéposée('PPE2');
  await computePourcentageRéférencesRaccordement();
  await computePourcentageProjetAvecDossierRaccordementComplet('PPE2');
};
