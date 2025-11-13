import {
  registerUtilisateurQueries,
  registerUtilisateurUseCases,
  UtilisateurSaga,
} from '@potentiel-domain/utilisateur';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const setupUtilisateur = () => {
  registerUtilisateurQueries({
    find: findProjection,
    list: listProjection,
  });

  registerUtilisateurUseCases({
    loadAggregate,
  });

  UtilisateurSaga.register();
};
