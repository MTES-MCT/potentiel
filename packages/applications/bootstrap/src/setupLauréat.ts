import { mediator } from 'mediateur';

import {
  registerLauréatQueries,
  registerLauréatUseCases,
  GarantiesFinancières,
  Lauréat,
  ReprésentantLégal,
  Actionnaire,
} from '@potentiel-domain/laureat';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  AbandonNotification,
  AchèvementNotification,
  GarantiesFinancièresNotification,
  ReprésentantLégalNotification,
} from '@potentiel-applications/notifications';
import {
  AbandonProjector,
  AchèvementProjector,
  GarantiesFinancièreProjector,
  LauréatProjector,
  ReprésentantLégalProjector,
  ActionnaireProjector,
  ChangementActionnaireProjector,
} from '@potentiel-applications/projectors';
import {
  consulterCahierDesChargesChoisiAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { SendEmail } from '@potentiel-applications/notifications';

type SetupLauréatDependencies = {
  sendEmail: SendEmail;
};

export const setupLauréat = async ({ sendEmail }: SetupLauréatDependencies) => {
  registerLauréatUseCases({
    loadAggregate,
  });

  registerLauréatQueries({
    find: findProjection,
    list: listProjection,
    récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
    consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
  });

  // Projectors
  LauréatProjector.register();
  AbandonProjector.register();
  GarantiesFinancièreProjector.register();
  AchèvementProjector.register();
  ReprésentantLégalProjector.register();
  ActionnaireProjector.register();
  ChangementActionnaireProjector.register();

  // Notifications
  AbandonNotification.register({ sendEmail });
  GarantiesFinancièresNotification.register({ sendEmail });
  AchèvementNotification.register({ sendEmail });
  ReprésentantLégalNotification.register({ sendEmail });

  // Sagas
  GarantiesFinancières.GarantiesFinancièresSaga.register();
  GarantiesFinancières.TypeGarantiesFinancièresSaga.register();
  Lauréat.LauréatSaga.register();
  ReprésentantLégal.ReprésentantLégalSaga.register();
  Actionnaire.ActionnaireSaga.register();

  const unsubscribeLauréatProjector = await subscribe<LauréatProjector.SubscriptionEvent>({
    name: 'projector',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V1', 'RebuildTriggered'],
    eventHandler: async (event) => {
      await mediator.send<LauréatProjector.Execute>({
        type: 'System.Projector.Lauréat',
        data: event,
      });
    },
  });

  const unsubscribeActionnaireProjector = await subscribe<ActionnaireProjector.SubscriptionEvent>({
    name: 'projector',
    streamCategory: 'actionnaire',
    eventType: [
      'ActionnaireImporté-V1',
      'ChangementActionnaireDemandé-V1',
      'ActionnaireModifié-V1',
      'RebuildTriggered',
    ],
    eventHandler: async (event) => {
      await mediator.send<ActionnaireProjector.Execute>({
        type: 'System.Projector.Lauréat.Actionnaire',
        data: event,
      });

      await mediator.send<ChangementActionnaireProjector.Execute>({
        type: 'System.Projector.Lauréat.ChangementActionnaire',
        data: event,
      });
    },
  });

  const unsubscribeLauréatSaga = await subscribe<Lauréat.LauréatSaga.SubscriptionEvent & Event>({
    name: 'laureat-saga',
    streamCategory: 'recours',
    eventType: ['RecoursAccordé-V1'],
    eventHandler: async (event) => {
      await mediator.publish<Lauréat.LauréatSaga.Execute>({
        type: 'System.Lauréat.Saga.Execute',
        data: event,
      });
    },
  });

  const unsubscribeAbandonNotification = await subscribe<AbandonNotification.SubscriptionEvent>({
    name: 'notifications',
    streamCategory: 'abandon',
    eventType: [
      'AbandonDemandé-V1',
      'AbandonAccordé-V1',
      'AbandonAnnulé-V1',
      'AbandonConfirmé-V1',
      'AbandonRejeté-V1',
      'ConfirmationAbandonDemandée-V1',
      'PreuveRecandidatureDemandée-V1',
    ],
    eventHandler: async (event) => {
      await mediator.publish<AbandonNotification.Execute>({
        type: 'System.Notification.Lauréat.Abandon',
        data: event,
      });
    },
  });

  const unsubscribeAbandonProjector = await subscribe<AbandonProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'AbandonDemandé-V1',
      'AbandonAccordé-V1',
      'AbandonAnnulé-V1',
      'AbandonConfirmé-V1',
      'AbandonRejeté-V1',
      'PreuveRecandidatureTransmise-V1',
      'PreuveRecandidatureDemandée-V1',
      'ConfirmationAbandonDemandée-V1',
      'RebuildTriggered',
    ],
    eventHandler: async (event) => {
      await mediator.send<AbandonProjector.Execute>({
        type: 'System.Projector.Lauréat.Abandon',
        data: event,
      });
    },
    streamCategory: 'abandon',
  });

  const unsubscribeGarantiesFinancièresProjector =
    await subscribe<GarantiesFinancièreProjector.SubscriptionEvent>({
      name: 'projector',
      eventType: [
        'GarantiesFinancièresDemandées-V1',
        'DépôtGarantiesFinancièresSoumis-V1',
        'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
        'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
        'DépôtGarantiesFinancièresEnCoursModifié-V1',
        'DépôtGarantiesFinancièresEnCoursValidé-V1',
        'DépôtGarantiesFinancièresEnCoursValidé-V2',
        'TypeGarantiesFinancièresImporté-V1',
        'GarantiesFinancièresModifiées-V1',
        'AttestationGarantiesFinancièresEnregistrée-V1',
        'GarantiesFinancièresEnregistrées-V1',
        'HistoriqueGarantiesFinancièresEffacé-V1',
        'MainlevéeGarantiesFinancièresDemandée-V1',
        'DemandeMainlevéeGarantiesFinancièresAnnulée-V1',
        'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
        'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
        'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
        'GarantiesFinancièresÉchues-V1',
        'RebuildTriggered',
      ],
      eventHandler: async (event) => {
        await mediator.send<GarantiesFinancièreProjector.Execute>({
          type: 'System.Projector.Lauréat.GarantiesFinancières',
          data: event,
        });
      },
      streamCategory: 'garanties-financieres',
    });

  const unsubscribeAchèvementProjector = await subscribe<AchèvementProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'AttestationConformitéTransmise-V1',
      'AttestationConformitéModifiée-V1',
      'RebuildTriggered',
    ],
    eventHandler: async (event) => {
      await mediator.send<AchèvementProjector.Execute>({
        type: 'System.Projector.Lauréat.Achèvement',
        data: event,
      });
    },
    streamCategory: 'achevement',
  });

  const unsubscribeGarantiesFinancièresNotification =
    await subscribe<GarantiesFinancièresNotification.SubscriptionEvent>({
      name: 'notifications',
      streamCategory: 'garanties-financieres',
      eventType: [
        'DépôtGarantiesFinancièresSoumis-V1',
        'DépôtGarantiesFinancièresEnCoursValidé-V1',
        'DépôtGarantiesFinancièresEnCoursValidé-V2',
        'AttestationGarantiesFinancièresEnregistrée-V1',
        'GarantiesFinancièresModifiées-V1',
        'GarantiesFinancièresEnregistrées-V1',
        'MainlevéeGarantiesFinancièresDemandée-V1',
        'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
        'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
        'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
        'GarantiesFinancièresÉchues-V1',
      ],
      eventHandler: async (event) => {
        await mediator.publish<GarantiesFinancièresNotification.Execute>({
          type: 'System.Notification.Lauréat.GarantiesFinancières',
          data: event,
        });
      },
    });

  const unsubscribeAchèvementNotification =
    await subscribe<AchèvementNotification.SubscriptionEvent>({
      name: 'notifications',
      streamCategory: 'achevement',
      eventType: ['AttestationConformitéTransmise-V1'],
      eventHandler: async (event) => {
        await mediator.publish<AchèvementNotification.Execute>({
          type: 'System.Notification.Lauréat.Achèvement.AttestationConformité',
          data: event,
        });
      },
    });

  const unsubscribeGarantiesFinancièresSaga = await subscribe<
    GarantiesFinancières.GarantiesFinancièresSaga.SubscriptionEvent & Event
  >({
    name: 'garanties-financieres-saga',
    streamCategory: 'tâche-planifiée',
    eventType: ['TâchePlanifiéeExecutée-V1'],
    eventHandler: async (event) => {
      await mediator.publish<GarantiesFinancières.GarantiesFinancièresSaga.Execute>({
        type: 'System.Lauréat.GarantiesFinancières.Saga.Execute',
        data: event,
      });
    },
  });

  const unsubscribeReprésentantLégalProjector =
    await subscribe<ReprésentantLégalProjector.SubscriptionEvent>({
      name: 'projector',
      streamCategory: 'représentant-légal',
      eventType: [
        'ReprésentantLégalImporté-V1',
        'ReprésentantLégalModifié-V1',
        'ChangementReprésentantLégalDemandé-V1',
        'RebuildTriggered',
      ],
      eventHandler: async (event) => {
        await mediator.send<ReprésentantLégalProjector.Execute>({
          type: 'System.Projector.Lauréat.ReprésentantLégal',
          data: event,
        });
      },
    });

  const unsubscribeReprésentantLégalSaga = await subscribe<
    ReprésentantLégal.ReprésentantLégalSaga.SubscriptionEvent & Event
  >({
    name: 'representant-legal-saga',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V1'],
    eventHandler: async (event) =>
      mediator.publish<ReprésentantLégal.ReprésentantLégalSaga.Execute>({
        type: 'System.Lauréat.ReprésentantLégal.Saga.Execute',
        data: event,
      }),
  });

  const unsubscribeActionnaireSaga = await subscribe<
    ReprésentantLégal.ReprésentantLégalSaga.SubscriptionEvent & Event
  >({
    name: 'actionnaire-saga',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V1'],
    eventHandler: async (event) =>
      mediator.publish<Actionnaire.ActionnaireSaga.Execute>({
        type: 'System.Lauréat.Actionnaire.Saga.Execute',
        data: event,
      }),
  });

  const unsubscribeTypeGarantiesFinancièresSaga = await subscribe<
    GarantiesFinancières.TypeGarantiesFinancièresSaga.SubscriptionEvent & Event
  >({
    name: 'type-garanties-financieres-saga',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V1'],
    eventHandler: async (event) => {
      await mediator.publish<GarantiesFinancières.TypeGarantiesFinancièresSaga.Execute>({
        type: 'System.Lauréat.TypeGarantiesFinancières.Saga.Execute',
        data: event,
      });
    },
  });

  const unsubscribeReprésentantLégalNotification =
    await subscribe<ReprésentantLégalNotification.SubscriptionEvent>({
      name: 'notifications',
      streamCategory: 'représentant-légal',
      eventType: ['ReprésentantLégalModifié-V1', 'ChangementReprésentantLégalDemandé-V1'],
      eventHandler: async (event) =>
        mediator.publish<ReprésentantLégalNotification.Execute>({
          type: 'System.Notification.Lauréat.ReprésentantLégal',
          data: event,
        }),
    });

  return async () => {
    // projectors
    await unsubscribeLauréatProjector();
    await unsubscribeAbandonProjector();
    await unsubscribeGarantiesFinancièresProjector();
    await unsubscribeAchèvementProjector();
    await unsubscribeReprésentantLégalProjector();
    await unsubscribeActionnaireProjector();
    // notifications
    await unsubscribeAbandonNotification();
    await unsubscribeGarantiesFinancièresNotification();
    await unsubscribeAchèvementNotification();
    await unsubscribeReprésentantLégalNotification();
    // sagas
    await unsubscribeGarantiesFinancièresSaga();
    await unsubscribeTypeGarantiesFinancièresSaga();
    await unsubscribeLauréatSaga();
    await unsubscribeReprésentantLégalSaga();
    await unsubscribeActionnaireSaga();
  };
};
