import { mediator } from 'mediateur';

import {
  registerLauréatQueries,
  registerLauréatUseCases,
  GarantiesFinancières,
  ReprésentantLégal,
  Raccordement,
} from '@potentiel-domain/laureat';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import {
  GarantiesFinancièresNotification,
  ReprésentantLégalNotification,
} from '@potentiel-applications/notifications';
import {
  GarantiesFinancièreProjector,
  ReprésentantLégalProjector,
  RaccordementProjector,
} from '@potentiel-applications/projectors';
import {
  DocumentAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { SendEmail } from '@potentiel-applications/notifications';

import { getProjetAggregateRootAdapter } from './adapters/getProjetAggregateRoot.adapter';

type SetupLauréatDependencies = {
  sendEmail: SendEmail;
  récupérerGRDParVille: Raccordement.RécupererGRDParVillePort;
};

export const setupLauréat = async ({
  sendEmail,
  récupérerGRDParVille,
}: SetupLauréatDependencies) => {
  registerLauréatUseCases({
    loadAggregate,
    getProjetAggregateRoot: getProjetAggregateRootAdapter,
    supprimerDocumentProjetSensible: DocumentAdapter.remplacerDocumentProjetSensible,
  });

  registerLauréatQueries({
    find: findProjection,
    list: listProjection,
    count: countProjection,
    récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
  });

  // Projectors
  GarantiesFinancièreProjector.register();
  ReprésentantLégalProjector.register();

  // Notifications
  GarantiesFinancièresNotification.register({ sendEmail });
  ReprésentantLégalNotification.register({ sendEmail });

  // Sagas
  GarantiesFinancières.GarantiesFinancièresSaga.register();
  GarantiesFinancières.TypeGarantiesFinancièresSaga.register();
  ReprésentantLégal.ReprésentantLégalSaga.register();
  Raccordement.RaccordementSaga.register({
    récupérerGRDParVille,
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

  const unsubscribeReprésentantLégalProjector =
    await subscribe<ReprésentantLégalProjector.SubscriptionEvent>({
      name: 'projector',
      streamCategory: 'représentant-légal',
      eventType: [
        'ReprésentantLégalImporté-V1',
        'ReprésentantLégalModifié-V1',
        'ChangementReprésentantLégalDemandé-V1',
        'ChangementReprésentantLégalAnnulé-V1',
        'ChangementReprésentantLégalCorrigé-V1',
        'ChangementReprésentantLégalAccordé-V1',
        'ChangementReprésentantLégalRejeté-V1',
        'ChangementReprésentantLégalSupprimé-V1',
        'RebuildTriggered',
      ],
      eventHandler: async (event) => {
        await mediator.send<ReprésentantLégalProjector.Execute>({
          type: 'System.Projector.Lauréat.ReprésentantLégal',
          data: event,
        });
      },
    });

  const unsubscribeReprésentantLégalSagaLauréat = await subscribe<
    ReprésentantLégal.ReprésentantLégalSaga.SubscriptionEvent & Event
  >({
    name: 'representant-legal-laureat-saga',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V2'],
    eventHandler: async (event) =>
      mediator.publish<ReprésentantLégal.ReprésentantLégalSaga.Execute>({
        type: 'System.Lauréat.ReprésentantLégal.Saga.Execute',
        data: event,
      }),
  });

  const unsubscribeReprésentantLégalSagaTâchePlanifiée = await subscribe<
    ReprésentantLégal.ReprésentantLégalSaga.SubscriptionEvent & Event
  >({
    name: 'representant-legal-tache-planifiee-saga',
    streamCategory: 'tâche-planifiée',
    eventType: ['TâchePlanifiéeExecutée-V1'],
    eventHandler: async (event) =>
      mediator.publish<ReprésentantLégal.ReprésentantLégalSaga.Execute>({
        type: 'System.Lauréat.ReprésentantLégal.Saga.Execute',
        data: event,
      }),
  });

  const unsubscribeReprésentantLégalSagaAbandon = await subscribe<
    ReprésentantLégal.ReprésentantLégalSaga.SubscriptionEvent & Event
  >({
    name: 'representant-legal-abandon-saga',
    streamCategory: 'abandon',
    eventType: ['AbandonAccordé-V1'],
    eventHandler: async (event) =>
      mediator.publish<ReprésentantLégal.ReprésentantLégalSaga.Execute>({
        type: 'System.Lauréat.ReprésentantLégal.Saga.Execute',
        data: event,
      }),
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

  const unsubscribeReprésentantLégalNotification =
    await subscribe<ReprésentantLégalNotification.SubscriptionEvent>({
      name: 'notifications',
      streamCategory: 'représentant-légal',
      eventType: [
        'ReprésentantLégalModifié-V1',
        'ChangementReprésentantLégalDemandé-V1',
        'ChangementReprésentantLégalAnnulé-V1',
        'ChangementReprésentantLégalCorrigé-V1',
        'ChangementReprésentantLégalAccordé-V1',
        'ChangementReprésentantLégalRejeté-V1',
      ],
      eventHandler: async (event) =>
        mediator.publish<ReprésentantLégalNotification.Execute>({
          type: 'System.Notification.Lauréat.ReprésentantLégal',
          data: event,
        }),
    });

  const unsubscribeRaccordementAbandonSaga = await subscribe<
    Raccordement.RaccordementSaga.SubscriptionEvent & Event
  >({
    name: 'raccordement-abandon-saga',
    streamCategory: 'abandon',
    eventType: ['AbandonAccordé-V1'],
    eventHandler: async (event) => {
      await mediator.publish<Raccordement.RaccordementSaga.Execute>({
        type: 'System.Lauréat.Raccordement.Saga.Execute',
        data: event,
      });
    },
  });
  const unsubscribeRaccordementLauréatSaga = await subscribe<
    Raccordement.RaccordementSaga.SubscriptionEvent & Event
  >({
    name: 'raccordement-laureat-saga',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V2'],
    eventHandler: async (event) => {
      await mediator.publish<Raccordement.RaccordementSaga.Execute>({
        type: 'System.Lauréat.Raccordement.Saga.Execute',
        data: event,
      });
    },
  });
  const unsubscribeRaccordementProjector = await subscribe<RaccordementProjector.SubscriptionEvent>(
    {
      name: 'projector',
      eventType: [
        'RebuildTriggered',
        'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
        'DateMiseEnServiceTransmise-V1',
        'DateMiseEnServiceTransmise-V2',
        'DemandeComplèteDeRaccordementTransmise-V1',
        'DemandeComplèteDeRaccordementTransmise-V2',
        'DemandeComplèteDeRaccordementTransmise-V3',
        'DemandeComplèteRaccordementModifiée-V1',
        'DemandeComplèteRaccordementModifiée-V2',
        'DemandeComplèteRaccordementModifiée-V3',
        'GestionnaireRéseauRaccordementModifié-V1',
        'GestionnaireRéseauInconnuAttribué-V1',
        'PropositionTechniqueEtFinancièreModifiée-V1',
        'PropositionTechniqueEtFinancièreModifiée-V2',
        'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
        'PropositionTechniqueEtFinancièreTransmise-V1',
        'PropositionTechniqueEtFinancièreTransmise-V2',
        'RéférenceDossierRacordementModifiée-V1',
        'RéférenceDossierRacordementModifiée-V2',
        'GestionnaireRéseauAttribué-V1',
        'DossierDuRaccordementSupprimé-V1',
        'DateMiseEnServiceSupprimée-V1',
        'RaccordementSupprimé-V1',
      ],
      eventHandler: async (event) => {
        await mediator.send<RaccordementProjector.Execute>({
          type: 'System.Projector.Lauréat.Raccordement',
          data: event,
        });
      },
      streamCategory: 'raccordement',
    },
  );

  return async () => {
    // projectors
    await unsubscribeGarantiesFinancièresProjector();
    await unsubscribeReprésentantLégalProjector();
    await unsubscribeRaccordementProjector();
    // notifications
    await unsubscribeGarantiesFinancièresNotification();
    await unsubscribeReprésentantLégalNotification();
    // sagas
    await unsubscribeGarantiesFinancièresSaga();
    await unsubscribeGarantiesFinancièresRecoursSaga();
    await unsubscribeGarantiesFinancièresProducteurSaga();
    await unsubscribeTypeGarantiesFinancièresSaga();
    await unsubscribeReprésentantLégalSagaLauréat();
    await unsubscribeReprésentantLégalSagaTâchePlanifiée();
    await unsubscribeReprésentantLégalSagaAbandon();
    await unsubscribeRaccordementAbandonSaga();
    await unsubscribeRaccordementLauréatSaga();
  };
};
