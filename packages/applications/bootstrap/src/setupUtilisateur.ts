import { registerUtilisateurQueries } from '@potentiel-domain/utilisateur';
import {
  récupérerRégionDrealAdapter,
  récupérerUtilisateurAdapter,
  vérifierAccèsProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';

export const setupUtilisateur = () => {
  registerUtilisateurQueries({
    récupérerUtilisateur: récupérerUtilisateurAdapter,
    vérifierAccèsProjet: vérifierAccèsProjetAdapter,
    récupérerRégionDreal: récupérerRégionDrealAdapter,
  });
};
