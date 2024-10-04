import { mediator } from 'mediateur';

import { registerEliminéQueries, registerEliminéUseCases } from '@potentiel-domain/elimine';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  listerIdentifiantsProjetsParPorteurAdapter,
  RecoursAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { RecoursProjector, ÉliminéProjector } from '@potentiel-applications/projectors';
import { RecoursNotification, SendEmail } from '@potentiel-applications/notifications';

type SetupÉliminéDependencies = {
  sendEmail: SendEmail;
};

export const setupEliminé = async ({ sendEmail }: SetupÉliminéDependencies) => {
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
    eventType: ['ÉliminéNotifié-V1', 'ÉliminéArchivé-V1', 'RebuildTriggered'],
    eventHandler: async (event) => {
      await mediator.send<ÉliminéProjector.Execute>({
        type: 'System.Projector.Éliminé',
        data: event,
      });
    },
    streamCategory: 'éliminé',
  });

  return async () => {
    await unsubscribeRecoursProjector();
    await unsubscribeRecoursNotification();

    await unsubscribeÉliminéProjector();
  };
};
