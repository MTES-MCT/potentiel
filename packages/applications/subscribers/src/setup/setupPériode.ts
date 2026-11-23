import { PériodeNotification } from '@potentiel-applications/notifications';
import { PériodeProjector } from '@potentiel-applications/projectors';
import { Période } from '@potentiel-domain/periode';

import { createSubscriptionSetup, type SubscriberSetup } from './createSubscriptionSetup.js';

export type SetupPériodeDependencies = {
  récupérerCandidaturesÀImporter: Période.RécupérerCandidaturesÀImporterPort;
};
export type SetupPériode = (dependencies: SetupPériodeDependencies) => SubscriberSetup;

export const setupPériode: SetupPériode = ({ récupérerCandidaturesÀImporter }) => {
  const période = createSubscriptionSetup('période');

  Période.PériodeSaga.register({ récupérerCandidaturesÀImporter });

  PériodeProjector.register();
  période.addSubscription<PériodeProjector.SubscriptionEvent, PériodeProjector.Execute>({
    name: 'projector',
    eventType: ['PériodeNotifiée-V1', 'RebuildTriggered'],
    messageType: 'System.Projector.Période',
  });

  PériodeNotification.register();
  période.addSubscription<PériodeNotification.SubscriptionEvent, PériodeNotification.Execute>({
    name: 'notifications',
    eventType: ['PériodeNotifiée-V1'],
    messageType: 'System.Notification.Période',
  });

  période.addSubscription<Période.PériodeSaga.SubscriptionEvent, Période.PériodeSaga.Execute>({
    name: 'periode-saga',
    eventType: ['ImportPériodeInitié-V1'],
    messageType: 'System.Période.Saga.Execute',
  });

  return période;
};
