import { AttestationSaga } from '@potentiel-applications/document-builder';
import { CandidatureNotification } from '@potentiel-applications/notifications';
import { CandidatureProjector, type HistoriqueProjector } from '@potentiel-applications/projectors';
import type { ProjetSaga } from '@potentiel-domain/projet';

import { createSubscriptionSetup, type SubscriberSetup } from '../createSubscriptionSetup.js';

type SetupCandidature = () => SubscriberSetup;

export const setupCandidature: SetupCandidature = () => {
  const candidature = createSubscriptionSetup('candidature');

  CandidatureProjector.register();
  candidature.addSubscription<CandidatureProjector.SubscriptionEvent, CandidatureProjector.Execute>(
    {
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
    },
  );

  CandidatureNotification.register();
  candidature.addSubscription<
    CandidatureNotification.SubscriptionEvent,
    CandidatureNotification.Execute
  >({
    name: 'notifications',
    eventType: ['CandidatureCorrigée-V2'],
    messageType: 'System.Notification.Candidature',
  });

  AttestationSaga.register();
  candidature.addSubscription<AttestationSaga.SubscriptionEvent, AttestationSaga.Execute>({
    name: 'attestation-saga',
    eventType: ['CandidatureNotifiée-V3', 'CandidatureCorrigée-V2'],
    messageType: 'System.Candidature.Attestation.Saga.Execute',
    maxConcurrency: 5,
  });

  candidature.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  candidature.addSubscription<ProjetSaga.SubscriptionEvent, ProjetSaga.Execute>({
    name: 'projet-candidature-saga',
    eventType: ['CandidatureNotifiée-V3'],
    messageType: 'System.Projet.Saga.Execute',
  });

  return candidature;
};
