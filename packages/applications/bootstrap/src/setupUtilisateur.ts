import {
  registerUtilisateurQueries,
  registerUtilisateurUseCases,
} from '@potentiel-domain/utilisateur';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const setupUtilisateur = () => {
  registerUtilisateurQueries({
    find: findProjection,
    list: listProjection,
  });

  registerUtilisateurUseCases({
    loadAggregate: loadAggregateV2,
  });
};
