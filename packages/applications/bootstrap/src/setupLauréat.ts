import { registerLauréatQueries, registerLauréatUseCases } from '@potentiel-domain/laureat';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  AbandonNotification,
  GarantiesFinancièresNotification,
} from '@potentiel-infrastructure/notifications';
import {
  AbandonProjector,
  GarantiesFinancièreProjector,
} from '@potentiel-infrastructure/projectors';
import { mediator } from 'mediateur';
import {
  consulterCahierDesChargesChoisiAdapter,
  listerAbandonsAdapter,
  listerAbandonsPourPorteurAdapter,
  listerGarantiesFinancièresAdapter,
  récupérerRégionDreal,
} from '@potentiel-infrastructure/domain-adapters';
import { getModèleRéponseAbandon } from '@potentiel-infrastructure/document-builder';

export const setupLauréat = async () => {
  registerLauréatUseCases({
    loadAggregate,
  });

  registerLauréatQueries({
    find: findProjection,
    list: listProjection,
    consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
    listerAbandonsPourPorteur: listerAbandonsPourPorteurAdapter,
    buildModèleRéponseAbandon: getModèleRéponseAbandon,
    listerAbandons: listerAbandonsAdapter,
    listerGarantiesFinancières: listerGarantiesFinancièresAdapter,
    récupérerRégionDreal: récupérerRégionDreal,
  });

  AbandonProjector.register();
  AbandonNotification.register();
  GarantiesFinancièreProjector.register();
  GarantiesFinancièresNotification.register();

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
        'GarantiesFinancièresSoumises-V1',
        'GarantiesFinancièresÀTraiterSupprimées-V1',
        'GarantiesFinancièresValidées-V1',
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
      eventType: ['GarantiesFinancièresSoumises-V1'],
      eventHandler: async (event) => {
        await mediator.publish<GarantiesFinancièresNotification.Execute>({
          type: 'System.Notification.Lauréat.GarantiesFinancières',
          data: event,
        });
      },
    });

  return async () => {
    await unsubscribeAbandonNotification();
    await unsubscribeAbandonProjector();
    await unsubscribeGarantiesFinancièresProjector();
    await unsubscribeGarantiesFinancièresNotification();
  };
};
