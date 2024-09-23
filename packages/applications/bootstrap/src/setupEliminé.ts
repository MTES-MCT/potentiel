import { mediator } from 'mediateur';

import { registerEliminéQueries, registerEliminéUseCases } from '@potentiel-domain/elimine';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  listerIdentifiantsProjetsParPorteurAdapter,
  RecoursAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { RecoursProjector, ÉliminéProjector } from '@potentiel-applications/projectors';
import {
  RecoursNotification,
  SendEmail,
  ÉliminéNotification,
} from '@potentiel-applications/notifications';
import { AttestationSaga } from '@potentiel-applications/document-builder';

type SetupÉliminéDependenices = {
  sendEmail: SendEmail;
};

export const setupEliminé = async ({ sendEmail }: SetupÉliminéDependenices) => {
  registerEliminéUseCases({
    loadAggregate,
  });

  registerEliminéQueries({
    find: findProjection,
    list: listProjection,
    listerProjetsAccessibles: listerIdentifiantsProjetsParPorteurAdapter,
    consulterRecoursAdapter: RecoursAdapter.consulterRecoursAdapter,
  });

  ÉliminéProjector.register();
  ÉliminéNotification.register({ sendEmail });

  RecoursProjector.register();
  RecoursNotification.register({ sendEmail });

  const unsubscribeRecoursProjector = await subscribe<RecoursProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'RecoursDemandé-V1',
      'RecoursAccordé-V1',
      'RecoursAnnulé-V1',
      'RecoursRejeté-V1',
      'RebuildTriggered',
    ],
    eventHandler: async (event) => {
      await mediator.send<RecoursProjector.Execute>({
        type: 'System.Projector.Eliminé.Recours',
        data: event,
      });
    },
    streamCategory: 'recours',
  });

  const unsubscribeRecoursNotification = await subscribe<RecoursNotification.SubscriptionEvent>({
    name: 'notifications',
    eventType: ['RecoursDemandé-V1', 'RecoursAnnulé-V1', 'RecoursAccordé-V1', 'RecoursRejeté-V1'],
    eventHandler: async (event) => {
      await mediator.publish<RecoursNotification.Execute>({
        type: 'System.Notification.Éliminé.Recours',
        data: event,
      });
    },
    streamCategory: 'recours',
  });

  const unsubscribeÉliminéProjector = await subscribe<ÉliminéProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: ['ÉliminéNotifié-V1', 'RebuildTriggered'],
    eventHandler: async (event) => {
      await mediator.send<ÉliminéProjector.Execute>({
        type: 'System.Projector.Éliminé',
        data: event,
      });
    },
    streamCategory: 'éliminé',
  });

  const unsubscribeÉliminéNotification = await subscribe<ÉliminéNotification.SubscriptionEvent>({
    name: 'notifications',
    streamCategory: 'éliminé',
    eventType: ['ÉliminéNotifié-V1'],
    eventHandler: async (event) => {
      await mediator.publish<ÉliminéNotification.Execute>({
        type: 'System.Notification.Éliminé',
        data: event,
      });
    },
  });

  const unsubscribeÉliminéSaga = await subscribe<AttestationSaga.SubscriptionEvent & Event>({
    name: 'elimine-saga',
    streamCategory: 'éliminé',
    eventType: ['ÉliminéNotifié-V1'],
    eventHandler: async (event) => {
      await mediator.publish<AttestationSaga.Execute>({
        type: 'System.Candidature.Attestation.Saga.Execute',
        data: event,
      });
    },
  });

  return async () => {
    await unsubscribeRecoursProjector();
    await unsubscribeRecoursNotification();

    await unsubscribeÉliminéProjector();
    await unsubscribeÉliminéNotification();
    await unsubscribeÉliminéSaga();
  };
};
