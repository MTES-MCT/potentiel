import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureProjector } from '@potentiel-applications/projectors';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { AttestationSaga } from '@potentiel-applications/document-builder';
import { CandidatureNotification, SendEmail } from '@potentiel-applications/notifications';

type SetupCandidatureDependencies = {
  sendEmail: SendEmail;
};

export const setupCandidature = async ({ sendEmail }: SetupCandidatureDependencies) => {
  Candidature.registerCandidaturesUseCases({ loadAggregate });

  Candidature.registerCandidatureQueries({
    find: findProjection,
    récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
    récupérerProjetsEligiblesPreuveRecanditure:
      CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
    list: listProjection,
  });

  CandidatureProjector.register();

  CandidatureNotification.register({ sendEmail });

  AttestationSaga.register();

  const unsubscribeCandidatureProjector = await subscribe<CandidatureProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'CandidatureImportée-V1',
      'CandidatureCorrigée-V1',
      'CandidatureNotifiée-V1',
      'CandidatureNotifiée-V2',
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
      eventType: ['CandidatureCorrigée-V1'],
      eventHandler: async (event) => {
        await mediator.publish<CandidatureNotification.Execute>({
          type: 'System.Notification.Candidature',
          data: event,
        });
      },
    });

  const unsubscribeAttestationSaga = await subscribe<AttestationSaga.SubscriptionEvent & Event>({
    name: 'attestation-saga',
    streamCategory: 'candidature',
    eventType: ['CandidatureNotifiée-V2', 'CandidatureCorrigée-V1'],
    eventHandler: async (event) => {
      await mediator.publish<AttestationSaga.Execute>({
        type: 'System.Candidature.Attestation.Saga.Execute',
        data: event,
      });
    },
  });

  return async () => {
    await unsubscribeCandidatureProjector();
    await unsubscribeAttestationSaga();
    await unsubscribeCandidatureNotification();
  };
};
