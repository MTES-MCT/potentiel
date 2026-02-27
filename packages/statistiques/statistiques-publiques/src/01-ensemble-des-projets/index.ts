import { computeNombreDeProjetLauréatParAppelOffre } from './nombreDeProjetLauréatParAppelOffre.statistic.js';
import { computeNombreTotalProjet } from './nombreTotalProjet.statistic.js';
import { computeTotalPuissanceParAppelOffre } from './totalPuissanceParAppelOffre.statistic.js';
import { computeIndicateursProjetsAgrégés } from './indicateursProjetsAgrégés.statistic.js';

export const computeEnsembleDesProjets = async () => {
  await computeNombreDeProjetLauréatParAppelOffre();
  await computeNombreTotalProjet();
  await computeTotalPuissanceParAppelOffre();
  await computeIndicateursProjetsAgrégés();
};
