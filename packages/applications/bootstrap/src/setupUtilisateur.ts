import { mediator } from 'mediateur';

import {
  registerUtilisateurQueries,
  registerUtiliseurUseCases,
} from '@potentiel-domain/utilisateur';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { UtilisateurProjector } from '@potentiel-applications/projectors';

import { vérifierAccèsProjetAdapter } from './authorization/vérifierAccèsProjet';

export const setupUtilisateur = async () => {
  registerUtilisateurQueries({
    find: findProjection,
    list: listProjection,
    vérifierAccèsProjet: vérifierAccèsProjetAdapter,
  });

  registerUtiliseurUseCases({ loadAggregate });

  UtilisateurProjector.register();

  const unsubscribeUtilisateurProjector = await subscribe<UtilisateurProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: ['RebuildTriggered', 'UtilisateurInvité-V1', 'PorteurInvité-V1', 'ProjetRéclamé-V1'],
    eventHandler: async (event) => {
      await mediator.send<UtilisateurProjector.Execute>({
        type: 'System.Projector.Utilisateur',
        data: event,
      });
    },
    streamCategory: 'utilisateur',
  });
  return async () => {
    await unsubscribeUtilisateurProjector();
  };
};
