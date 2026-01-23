import { computeNombreDeDemandeParCategorie } from './nombreDeDemandeParCategorie.statistic.js';
import { computeNombreTotalDemande } from './nombreTotalDemande.statistic.js';

export const computeDemandesDeModification = async () => {
  await computeNombreDeDemandeParCategorie();
  await computeNombreTotalDemande();
};
