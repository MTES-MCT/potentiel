import { computeNombreDeDemandeParCategorie } from './nombreDeDemandeParCategorie.statistic';
import { computeNombreTotalDemande } from './nombreTotalDemande.statistic';

export const computeDemandesDeModification = async () => {
  await computeNombreDeDemandeParCategorie();
  await computeNombreTotalDemande();
};
