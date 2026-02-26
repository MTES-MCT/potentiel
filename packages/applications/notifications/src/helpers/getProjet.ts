import { getLauréat, ProjetNonTrouvéError } from './getLauréat.js';
import { getÉliminé } from './getÉliminé.js';

/***
 * Cette fonction permet de récupérer les informations d'un projet qu'il soit lauréat ou éliminé, en fonction de son identifiant.
 * À utiliser uniquement quand on ne connait pas le statut du projet au préalable.
 */
export const getProjet = async (identifiantProjet: string) => {
  try {
    return await getLauréat(identifiantProjet);
  } catch (e) {
    if (e instanceof ProjetNonTrouvéError) {
      // Si le projet n'est pas un lauréat, on tente de récupérer les informations en tant qu'éliminé
      return await getÉliminé(identifiantProjet);
    }

    // Si l'erreur n'est pas un ProjetNonTrouvéError, on la remonte
    throw e;
  }
};
