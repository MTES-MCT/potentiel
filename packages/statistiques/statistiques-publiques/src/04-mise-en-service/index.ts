import { computeNombreTotalProjetAvecDCRDéposée } from './nombreTotalProjetAvecDCRDéposée.statistic.js';
import { computeNombreTotalProjetAvecDossierRaccordementComplet } from './nombreTotalProjetAvecDossierRaccordementComplet.statistic.js';
import { computeNombreTotalProjetEnService } from './nombreTotalProjetEnService.statistic.js';
import { computeNombreTotalRéférencesRaccordement } from './nombreTotalRéférencesRaccordement.statistic.js';
import { computePourcentageProjetAvecDCRDéposée } from './pourcentageProjetAvecDCRDéposée.js';
import { computePourcentageProjetAvecDossierRaccordementComplet } from './pourcentageProjetAvecDossierRaccordementComplet.statistic.js';
import { computePourcentageProjetEnService } from './pourcentageProjetEnService.statistic.js';
import { computePourcentageRéférencesRaccordement } from './pourcentageRéférencesRaccordement.statistic.js';
import { computePuissanceTotaleMiseEnService } from './puissanceTotaleMiseEnService.stastistic.js';

export const computeMiseEnService = async () => {
  // Référence raccordement
  await computeNombreTotalRéférencesRaccordement();

  // Dossier raccordement
  await computeNombreTotalProjetAvecDossierRaccordementComplet();
  await computeNombreTotalProjetAvecDossierRaccordementComplet('PPE2');
  await computeNombreTotalProjetAvecDossierRaccordementComplet('CRE4');
  await computePourcentageProjetAvecDossierRaccordementComplet();
  await computePourcentageProjetAvecDossierRaccordementComplet('PPE2');
  await computePourcentageProjetAvecDossierRaccordementComplet('CRE4');
  await computePourcentageRéférencesRaccordement();

  // DCR
  await computeNombreTotalProjetAvecDCRDéposée();
  await computeNombreTotalProjetAvecDCRDéposée('PPE2');
  await computeNombreTotalProjetAvecDCRDéposée('CRE4');
  await computePourcentageProjetAvecDCRDéposée();
  await computePourcentageProjetAvecDCRDéposée('PPE2');
  await computePourcentageProjetAvecDCRDéposée('CRE4');

  // Mise en service
  await computeNombreTotalProjetEnService();
  await computeNombreTotalProjetEnService('PPE2');
  await computeNombreTotalProjetEnService('CRE4');
  await computePourcentageProjetEnService();
  await computePourcentageProjetEnService('PPE2');
  await computePourcentageProjetEnService('CRE4');
  await computePuissanceTotaleMiseEnService();
  await computePuissanceTotaleMiseEnService('PPE2');
  await computePuissanceTotaleMiseEnService('CRE4');
};
