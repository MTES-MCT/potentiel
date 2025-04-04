import { mediator } from 'mediateur';

import { registerProjetUseCases, registerProjetQueries } from '@potentiel-domain/projet';
import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { RecoursProjector, ÉliminéProjector } from '@potentiel-applications/projectors';
import { RecoursNotification, SendEmail } from '@potentiel-applications/notifications';

import { getProjetAggregateRootAdapter } from './adapters/getProjetAggregateRoot.adapter';
import { récupererProjetsPorteurAdapter } from './authorization/récupérerIdentifiantsProjetParPorteur';

type SetupProjetDependencies = {
  sendEmail: SendEmail;
};

export const setupProjet = async ({ sendEmail }: SetupProjetDependencies) => {
  registerProjetUseCases({
    getProjetAggregateRoot: getProjetAggregateRootAdapter,
  });

  registerProjetQueries({
    find: findProjection,
    list: listProjection,
    récupérerIdentifiantsProjetParEmailPorteur: récupererProjetsPorteurAdapter,
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
      'RecoursPasséEnInstruction-V1',
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
        type: 'System.Notification.Eliminé.Recours',
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
        type: 'System.Projector.Eliminé',
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
