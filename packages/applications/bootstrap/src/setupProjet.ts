import { mediator } from 'mediateur';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { registerProjetUseCases, registerProjetQueries, Lauréat } from '@potentiel-domain/projet';
import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  AccèsProjector,
  CandidatureProjector,
  LauréatProjector,
  PuissanceProjector,
  RecoursProjector,
  ÉliminéProjector,
} from '@potentiel-applications/projectors';
import {
  AccèsNotification,
  CandidatureNotification,
  PuissanceNotification,
  RecoursNotification,
  SendEmail,
} from '@potentiel-applications/notifications';
import {
  CandidatureAdapter,
  consulterCahierDesChargesChoisiAdapter,
  DélaiAdapter,
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
    récupérerProjetsEligiblesPreuveRecanditure:
      CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
    consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
    consulterABénéficiéDuDélaiCDC2022: DélaiAdapter.consulterABénéficiéDuDélaiCDC2022Adapter,
  });

  LauréatProjector.register();
  ÉliminéProjector.register();

  RecoursProjector.register();
  RecoursNotification.register({ sendEmail });

  const unsubscribeLauréatProjector = await subscribe<LauréatProjector.SubscriptionEvent>({
    name: 'projector',
    streamCategory: 'lauréat',
    eventType: [
      'LauréatNotifié-V1',
      'NomEtLocalitéLauréatImportés-V1',
      'LauréatNotifié-V2',
      'LauréatModifié-V1',
      'CahierDesChargesChoisi-V1',
      'RebuildTriggered',
    ],
    eventHandler: async (event) => {
      await mediator.send<LauréatProjector.Execute>({
        type: 'System.Projector.Lauréat',
        data: event,
      });
    },
  });

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

  AccèsProjector.register();
  AccèsNotification.register({ sendEmail });

  AttestationSaga.register();

  const unsubscribeAccèsProjector = await subscribe<AccèsProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: ['RebuildTriggered', 'AccèsProjetAutorisé-V1', 'AccèsProjetRetiré-V1'],
    eventHandler: async (event) => {
      await mediator.send<AccèsProjector.Execute>({
        type: 'System.Projector.Accès',
        data: event,
      });
    },
    streamCategory: 'accès',
  });

  const unsubscribeAccèsNotification = await subscribe<AccèsNotification.SubscriptionEvent>({
    name: 'notifications',
    eventType: ['AccèsProjetRetiré-V1'],
    eventHandler: async (event) => {
      await mediator.send<AccèsNotification.Execute>({
        type: 'System.Notification.Accès',
        data: event,
      });
    },
    streamCategory: 'accès',
  });

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

  Lauréat.Puissance.PuissanceSaga.register();
  PuissanceNotification.register({ sendEmail });
  PuissanceProjector.register();

  const unsubscribePuissanceProjector = await subscribe<PuissanceProjector.SubscriptionEvent>({
    name: 'projector',
    streamCategory: 'puissance',
    eventType: [
      'RebuildTriggered',
      'PuissanceImportée-V1',
      'PuissanceModifiée-V1',
      'ChangementPuissanceDemandé-V1',
      'ChangementPuissanceAnnulé-V1',
      'ChangementPuissanceSupprimé-V1',
      'ChangementPuissanceEnregistré-V1',
      'ChangementPuissanceAccordé-V1',
      'ChangementPuissanceRejeté-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<PuissanceProjector.Execute>({
        type: 'System.Projector.Lauréat.Puissance',
        data: event,
      });
    },
  });

  const unsubscribePuissanceNotification = await subscribe<PuissanceNotification.SubscriptionEvent>(
    {
      name: 'notifications',
      streamCategory: 'puissance',
      eventType: [
        'PuissanceModifiée-V1',
        'ChangementPuissanceDemandé-V1',
        'ChangementPuissanceAnnulé-V1',
        'ChangementPuissanceSupprimé-V1',
        'ChangementPuissanceAccordé-V1',
        'ChangementPuissanceRejeté-V1',
        'ChangementPuissanceEnregistré-V1',
      ],
      eventHandler: async (event) => {
        await mediator.publish<PuissanceNotification.Execute>({
          type: 'System.Notification.Lauréat.Puissance',
          data: event,
        });
      },
    },
  );
  const unsubscribePuissanceSagaAbandon = await subscribe<
    Lauréat.Puissance.PuissanceSaga.SubscriptionEvent & Event
  >({
    name: 'puissance-abandon-saga',
    streamCategory: 'abandon',
    eventType: ['AbandonAccordé-V1'],
    eventHandler: async (event) =>
      mediator.publish<Lauréat.Puissance.PuissanceSaga.Execute>({
        type: 'System.Lauréat.Puissance.Saga.Execute',
        data: event,
      }),
  });

  return async () => {
    await unsubscribeLauréatProjector();

    await unsubscribeRecoursProjector();
    await unsubscribeRecoursNotification();

    await unsubscribeÉliminéProjector();

    await unsubscribeCandidatureProjector();
    await unsubscribeAttestationSaga();
    await unsubscribeCandidatureNotification();

    await unsubscribeAccèsProjector();
    await unsubscribeAccèsNotification();

    await unsubscribePuissanceProjector();
    await unsubscribePuissanceNotification();
    await unsubscribePuissanceSagaAbandon();
  };
};
