import { mediator } from 'mediateur';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { registerProjetUseCases, registerProjetQueries } from '@potentiel-domain/projet';
import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  CandidatureProjector,
  RecoursProjector,
  ÉliminéProjector,
} from '@potentiel-applications/projectors';
import {
  CandidatureNotification,
  RecoursNotification,
  SendEmail,
} from '@potentiel-applications/notifications';
import {
  CandidatureAdapter,
  getProjetUtilisateurScopeAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { AttestationSaga } from '@potentiel-applications/document-builder';

import { getProjetAggregateRootAdapter } from './adapters/getProjetAggregateRoot.adapter';

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
    getScopeProjetUtilisateur: getProjetUtilisateurScopeAdapter,
    récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
    récupérerProjetsEligiblesPreuveRecanditure:
      CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
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
    await unsubscribeRecoursProjector();
    await unsubscribeRecoursNotification();
    await unsubscribeÉliminéProjector();
    await unsubscribeCandidatureProjector();
    await unsubscribeAttestationSaga();
    await unsubscribeCandidatureNotification();
  };
};
