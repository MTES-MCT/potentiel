import { registerUtilisateurQueries } from '@potentiel-domain/utilisateur';
import {
  récupérerUtilisateurAdapter,
  vérifierAccèsProjetAdapter,
  listerUtilisateursAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { findProjection } from '@potentiel-infrastructure/pg-projections';

export const setupUtilisateur = () => {
  registerUtilisateurQueries({
    récupérerUtilisateur: récupérerUtilisateurAdapter,
    vérifierAccèsProjet: vérifierAccèsProjetAdapter,
    listerUtilisateurs: listerUtilisateursAdapter,
    find: findProjection,
  });
};
