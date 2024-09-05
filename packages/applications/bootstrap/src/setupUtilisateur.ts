import { registerUtilisateurQueries } from '@potentiel-domain/utilisateur';
import {
  récupérerUtilisateurAdapter,
  vérifierAccèsProjetAdapter,
  listerUtilisateursAdapter,
} from '@potentiel-infrastructure/domain-adapters';

export const setupUtilisateur = () => {
  registerUtilisateurQueries({
    récupérerUtilisateur: récupérerUtilisateurAdapter,
    vérifierAccèsProjet: vérifierAccèsProjetAdapter,
    listerUtilisateur: listerUtilisateursAdapter,
  });
};
