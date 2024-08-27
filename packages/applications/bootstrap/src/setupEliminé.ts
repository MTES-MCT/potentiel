import { mediator } from 'mediateur';

import { registerEliminéQueries, registerEliminéUseCases } from '@potentiel-domain/elimine';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { listerIdentifiantsProjetsParPorteurAdapter } from '@potentiel-infrastructure/domain-adapters';
import { RecoursProjector, ÉliminéProjector } from '@potentiel-applications/projectors';
import { SendEmail, ÉliminéNotification } from '@potentiel-applications/notifications';

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
  });

  ÉliminéProjector.register();
  ÉliminéNotification.register({ sendEmail });
  RecoursProjector.register();

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

  return async () => {
    await unsubscribeRecoursProjector();
    await unsubscribeÉliminéProjector();
    await unsubscribeÉliminéNotification();
  };
};
