import { mediator } from 'mediateur';

import {
  registerLauréatQueries,
  registerLauréatUseCases,
  GarantiesFinancières,
} from '@potentiel-domain/laureat';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  AbandonNotification,
  AchèvementNotification,
  GarantiesFinancièresNotification,
  LauréatNotification,
} from '@potentiel-applications/notifications';
import {
  AbandonProjector,
  AchèvementProjector,
  GarantiesFinancièreProjector,
  LauréatProjector,
} from '@potentiel-applications/projectors';
import {
  consulterCahierDesChargesChoisiAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { SendEmail } from '@potentiel-applications/notifications';

type SetupLauréatDependenices = {
  sendEmail: SendEmail;
};
export const setupLauréat = async ({ sendEmail }: SetupLauréatDependenices) => {
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
  LauréatNotification.register({ sendEmail });
  AbandonProjector.register();
  GarantiesFinancièreProjector.register();
  AchèvementProjector.register();
  AchèvementNotification.register({ sendEmail });

  // Notfications
  AbandonNotification.register({ sendEmail });
  GarantiesFinancièresNotification.register({ sendEmail });

  // Sagas
  GarantiesFinancières.GarantiesFinancièresSaga.register();

  const unsubscribeLauréatNotification = await subscribe<LauréatNotification.SubscriptionEvent>({
    name: 'notifications',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V1'],
    eventHandler: async (event) => {
      await mediator.publish<LauréatNotification.Execute>({
        type: 'System.Notification.Lauréat',
        data: event,
      });
    },
  });

  const unsubscribeLauréatProjector = await subscribe<LauréatProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: ['LauréatNotifié-V1', 'RebuildTriggered'],
    eventHandler: async (event) => {
      await mediator.send<LauréatProjector.Execute>({
        type: 'System.Projector.Lauréat',
        data: event,
      });
    },
    streamCategory: 'lauréat',
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

  return async () => {
    await unsubscribeLauréatNotification();
    await unsubscribeLauréatProjector();
    await unsubscribeAbandonNotification();
    await unsubscribeAbandonProjector();
    await unsubscribeGarantiesFinancièresProjector();
    await unsubscribeGarantiesFinancièresNotification();
    await unsubscribeAchèvementProjector();
    await unsubscribeAchèvementNotification();
    await unsubscribeGarantiesFinancièresSaga();
  };
};
