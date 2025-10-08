import { CandidatureProjector, HistoriqueProjector } from '@potentiel-applications/projectors';
import { CandidatureNotification } from '@potentiel-applications/notifications';
import { AttestationSaga } from '@potentiel-applications/document-builder';

import { createSubscriptionSetup } from '../createSubscriptionSetup';

import { SetupProjet } from './setup';

export const setupCandidature: SetupProjet = async ({ sendEmail }) => {
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
      'CandidatureImportée-V1',
      'CandidatureImportée-V2',
      'CandidatureCorrigée-V1',
      'CandidatureCorrigée-V2',
      'CandidatureNotifiée-V1',
      'CandidatureNotifiée-V2',
    ],
    messageType: 'System.Projector.Candidature',
  });

  CandidatureNotification.register({ sendEmail });
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
    eventType: ['CandidatureNotifiée-V2', 'CandidatureCorrigée-V2'],
    messageType: 'System.Candidature.Attestation.Saga.Execute',
  });

  await candidature.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return candidature.clearSubscriptions;
};
