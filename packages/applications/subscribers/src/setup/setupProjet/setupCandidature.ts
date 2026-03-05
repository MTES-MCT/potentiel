import { CandidatureProjector, HistoriqueProjector } from '@potentiel-applications/projectors';
import { CandidatureNotification } from '@potentiel-applications/notifications';
import { AttestationSaga } from '@potentiel-applications/document-builder';
import { ProjetSaga } from '@potentiel-domain/projet';
import { Unsubscribe } from '@potentiel-infrastructure/pg-event-sourcing';

import { createSubscriptionSetup } from '../createSubscriptionSetup.js';

type SetupCandidature = () => Promise<Unsubscribe>;

export const setupCandidature: SetupCandidature = async () => {
  const candidature = createSubscriptionSetup('candidature');

  CandidatureProjector.register();
  await candidature.setupSubscription<
    CandidatureProjector.SubscriptionEvent,
    CandidatureProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'DétailsFournisseursCandidatureImportés-V1',
      'DétailCandidatureImporté-V1',
      'CandidatureImportée-V1',
      'CandidatureImportée-V2',
      'CandidatureCorrigée-V1',
      'CandidatureCorrigée-V2',
      'CandidatureNotifiée-V1',
      'CandidatureNotifiée-V2',
      'CandidatureNotifiée-V3',
    ],
    messageType: 'System.Projector.Candidature',
  });

  CandidatureNotification.register();
  await candidature.setupSubscription<
    CandidatureNotification.SubscriptionEvent,
    CandidatureNotification.Execute
  >({
    name: 'notifications',
    eventType: ['CandidatureCorrigée-V2'],
    messageType: 'System.Notification.Candidature',
  });

  AttestationSaga.register();
  await candidature.setupSubscription<AttestationSaga.SubscriptionEvent, AttestationSaga.Execute>({
    name: 'attestation-saga',
    eventType: ['CandidatureNotifiée-V3', 'CandidatureCorrigée-V2'],
    messageType: 'System.Candidature.Attestation.Saga.Execute',
    maxConcurrency: 5,
  });

  await candidature.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  await candidature.setupSubscription<ProjetSaga.SubscriptionEvent, ProjetSaga.Execute>({
    name: 'projet-candidature-saga',
    eventType: ['CandidatureNotifiée-V3'],
    messageType: 'System.Projet.Saga.Execute',
  });

  return candidature.clearSubscriptions;
};
