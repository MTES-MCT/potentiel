import { computeNombreDeProjetLauréatParAppelOffre } from './nombreDeProjetLauréatParAppelOffre.statistic';
import { computeNombreTotalProjet } from './nombreTotalProjet.statistic';
import { computeTotalPuissanceParAppelOffre } from './totalPuissanceParAppelOffre.statistic';

export const computeEnsembleDesProjets = async () => {
  await computeNombreDeProjetLauréatParAppelOffre();
  await computeNombreTotalProjet();
  await computeTotalPuissanceParAppelOffre();
};
