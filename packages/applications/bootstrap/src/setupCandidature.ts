import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureProjector } from '@potentiel-applications/projectors';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureNotification, SendEmail } from '@potentiel-applications/notifications';

export const setupCandidature = async () => {
  Candidature.registerCandidaturesUseCases({ loadAggregate });

  Candidature.registerCandidatureQueries({
    find: findProjection,
    récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
    récupérerProjetsEligiblesPreuveRecanditure:
      CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
    récupérerProjets: CandidatureAdapter.récupérerProjetsAdapter,
    list: listProjection,
  });

  CandidatureProjector.register();
  CandidatureNotification.register({ sendEmail });

  const unsubscribeCandidatureProjector = await subscribe<CandidatureProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'CandidatureImportée-V1',
      'CandidatureCorrigée-V1',
      'LauréatNotifié-V1',
      'ÉliminéNotifié-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<CandidatureProjector.Execute>({
        type: 'System.Projector.Candidature',
        data: event,
      });
    },
    streamCategory: 'candidature',
  });

  const unsubscribeCandidatureNotification =
    await subscribe<CandidatureNotification.SubscriptionEvent>({
      name: 'notifications',
      streamCategory: 'candidature',
      eventType: ['LauréatNotifié-V1', 'ÉliminéNotifié-V1'],
      eventHandler: async (event) => {
        await mediator.publish<CandidatureNotification.Execute>({
          type: 'System.Notification.Candidature',
          data: event,
        });
      },
    });

  return async () => {
    await unsubscribeCandidatureProjector();
  };
};
