import { registerUtilisateurQueries } from '@potentiel-domain/utilisateur';
import { récupérerUtilisateurAdapter } from '@potentiel-infrastructure/domain-adapters';

export const setupUtilisateur = () => {
  registerUtilisateurQueries({
    récupérerUtilisateur: récupérerUtilisateurAdapter,
  });
};
