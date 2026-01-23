import { computeNombrePorteurInscrit } from './nombrePorteurInscrit.statistic.js';
import { computeUtilisateurCréation } from './utilisateurCréation.statistic.js';

export const computeUtilisateur = async () => {
  await computeNombrePorteurInscrit();
  await computeUtilisateurCréation();
};
