import { computeNombrePorteurInscrit } from './nombrePorteurInscrit.statistic';
import { computeUtilisateurCréation } from './utilisateurCréation.statistic';

export const computeUtilisateur = async () => {
  await computeNombrePorteurInscrit();
  await computeUtilisateurCréation();
};
