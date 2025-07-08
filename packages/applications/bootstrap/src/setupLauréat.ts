import { mediator } from 'mediateur';

import {
  registerLauréatQueries,
  registerLauréatUseCases,
  GarantiesFinancières,
} from '@potentiel-domain/laureat';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { GarantiesFinancièresNotification } from '@potentiel-applications/notifications';
import { GarantiesFinancièreProjector } from '@potentiel-applications/projectors';
import { récupérerIdentifiantsProjetParEmailPorteurAdapter } from '@potentiel-infrastructure/domain-adapters';
import { SendEmail } from '@potentiel-applications/notifications';

import { getProjetAggregateRootAdapter } from './adapters/getProjetAggregateRoot.adapter';

type SetupLauréatDependencies = {
  sendEmail: SendEmail;
};

export const setupLauréat = async ({ sendEmail }: SetupLauréatDependencies) => {
  registerLauréatUseCases({
    loadAggregate,
    getProjetAggregateRoot: getProjetAggregateRootAdapter,
  });

  registerLauréatQueries({
    find: findProjection,
    list: listProjection,
    récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
  });

  // Projectors
  GarantiesFinancièreProjector.register();

  // Notifications
  GarantiesFinancièresNotification.register({ sendEmail });

  // Sagas
  GarantiesFinancières.GarantiesFinancièresSaga.register();
  GarantiesFinancières.TypeGarantiesFinancièresSaga.register();

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

  const unsubscribeGarantiesFinancièresRecoursSaga = await subscribe<
    GarantiesFinancières.GarantiesFinancièresSaga.SubscriptionEvent & Event
  >({
    name: 'garanties-financieres-recours-saga',
    streamCategory: 'recours',
    eventType: ['RecoursAccordé-V1'],
    eventHandler: async (event) => {
      await mediator.publish<GarantiesFinancières.GarantiesFinancièresSaga.Execute>({
        type: 'System.Lauréat.GarantiesFinancières.Saga.Execute',
        data: event,
      });
    },
  });

  const unsubscribeGarantiesFinancièresProducteurSaga = await subscribe<
    GarantiesFinancières.GarantiesFinancièresSaga.SubscriptionEvent & Event
  >({
    name: 'garanties-financieres-producteur-saga',
    streamCategory: 'producteur',
    eventType: ['ChangementProducteurEnregistré-V1'],
    eventHandler: async (event) => {
      await mediator.publish<GarantiesFinancières.GarantiesFinancièresSaga.Execute>({
        type: 'System.Lauréat.GarantiesFinancières.Saga.Execute',
        data: event,
      });
    },
  });

  const unsubscribeTypeGarantiesFinancièresSaga = await subscribe<
    GarantiesFinancières.TypeGarantiesFinancièresSaga.SubscriptionEvent & Event
  >({
    name: 'type-garanties-financieres-saga',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V2'],
    eventHandler: async (event) => {
      await mediator.publish<GarantiesFinancières.TypeGarantiesFinancièresSaga.Execute>({
        type: 'System.Lauréat.TypeGarantiesFinancières.Saga.Execute',
        data: event,
      });
    },
  });

  return async () => {
    // projectors
    await unsubscribeGarantiesFinancièresProjector();
    // notifications
    await unsubscribeGarantiesFinancièresNotification();
    // sagas
    await unsubscribeGarantiesFinancièresSaga();
    await unsubscribeGarantiesFinancièresRecoursSaga();
    await unsubscribeGarantiesFinancièresProducteurSaga();
    await unsubscribeTypeGarantiesFinancièresSaga();
  };
};
