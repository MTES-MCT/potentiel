import { mediator } from 'mediateur';

import {
  registerLauréatQueries,
  registerLauréatUseCases,
  GarantiesFinancières,
  ReprésentantLégal,
  Actionnaire,
  Raccordement,
  Puissance,
} from '@potentiel-domain/laureat';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import {
  AbandonNotification,
  AchèvementNotification,
  ActionnaireNotification,
  GarantiesFinancièresNotification,
  LauréatNotification,
  ProducteurNotification,
  PuissanceNotification,
  ReprésentantLégalNotification,
} from '@potentiel-applications/notifications';
import {
  AbandonProjector,
  AchèvementProjector,
  GarantiesFinancièreProjector,
  ReprésentantLégalProjector,
  ActionnaireProjector,
  PuissanceProjector,
  ProducteurProjector,
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
  AbandonProjector.register();
  GarantiesFinancièreProjector.register();
  AchèvementProjector.register();
  ReprésentantLégalProjector.register();
  ActionnaireProjector.register();
  PuissanceProjector.register();
  ProducteurProjector.register();

  // Notifications
  AbandonNotification.register({ sendEmail });
  GarantiesFinancièresNotification.register({ sendEmail });
  AchèvementNotification.register({ sendEmail });
  ReprésentantLégalNotification.register({ sendEmail });
  ActionnaireNotification.register({ sendEmail });
  PuissanceNotification.register({ sendEmail });
  LauréatNotification.register({ sendEmail });
  ProducteurNotification.register({ sendEmail });

  // Sagas
  GarantiesFinancières.GarantiesFinancièresSaga.register();
  GarantiesFinancières.TypeGarantiesFinancièresSaga.register();
  ReprésentantLégal.ReprésentantLégalSaga.register();
  Actionnaire.ActionnaireSaga.register();
  Raccordement.RaccordementSaga.register({
    récupérerGRDParVille,
  });
  Puissance.PuissanceSaga.register();

  const unsubscribeLauréatNotifications = await subscribe<LauréatNotification.SubscriptionEvent>({
    name: 'notifications',
    streamCategory: 'lauréat',
    eventType: ['CahierDesChargesChoisi-V1'],
    eventHandler: async (event) => {
      await mediator.send<LauréatNotification.Execute>({
        type: 'System.Notification.Lauréat',
        data: event,
      });
    },
  });

  const unsubscribeActionnaireProjector = await subscribe<ActionnaireProjector.SubscriptionEvent>({
    name: 'projector',
    streamCategory: 'actionnaire',
    eventType: [
      'RebuildTriggered',
      'ActionnaireImporté-V1',
      'ActionnaireModifié-V1',
      'ChangementActionnaireDemandé-V1',
      'ChangementActionnaireAnnulé-V1',
      'ChangementActionnaireAccordé-V1',
      'ChangementActionnaireRejeté-V1',
      'ChangementActionnaireSupprimé-V1',
      'ChangementActionnaireEnregistré-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<ActionnaireProjector.Execute>({
        type: 'System.Projector.Lauréat.Actionnaire',
        data: event,
      });
    },
  });

  const unsubscribeAbandonNotification = await subscribe<AbandonNotification.SubscriptionEvent>({
    name: 'notifications',
    streamCategory: 'abandon',
    eventType: [
      'AbandonDemandé-V1',
      'AbandonDemandé-V2',
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
      'AbandonDemandé-V2',
      'AbandonAccordé-V1',
      'AbandonAnnulé-V1',
      'AbandonConfirmé-V1',
      'AbandonPasséEnInstruction-V1',
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

  const unsubscribeProducteurProjector = await subscribe<
    ProducteurProjector.SubscriptionEvent & Event
  >({
    name: 'projector',
    streamCategory: 'producteur',
    eventType: [
      'RebuildTriggered',
      'ProducteurImporté-V1',
      'ProducteurModifié-V1',
      'ChangementProducteurEnregistré-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<ProducteurProjector.Execute>({
        type: 'System.Projector.Lauréat.Producteur',
        data: event,
      });
    },
  });

  const unsubscribeProducteurNotification =
    await subscribe<ProducteurNotification.SubscriptionEvent>({
      name: 'notifications',
      streamCategory: 'producteur',
      eventType: ['ProducteurModifié-V1', 'ChangementProducteurEnregistré-V1'],
      eventHandler: async (event) => {
        await mediator.publish<ProducteurNotification.Execute>({
          type: 'System.Notification.Lauréat.Producteur',
          data: event,
        });
      },
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

  const unsubscribeActionnaireSaga = await subscribe<
    Actionnaire.ActionnaireSaga.SubscriptionEvent & Event
  >({
    name: 'actionnaire-laureat-saga',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V2'],
    eventHandler: async (event) =>
      mediator.publish<Actionnaire.ActionnaireSaga.Execute>({
        type: 'System.Lauréat.Actionnaire.Saga.Execute',
        data: event,
      }),
  });

  const unsubscribeActionnaireSagaAbandon = await subscribe<
    Actionnaire.ActionnaireSaga.SubscriptionEvent & Event
  >({
    name: 'actionnaire-abandon-saga',
    streamCategory: 'abandon',
    eventType: ['AbandonAccordé-V1'],
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

  const unsubscribeActionnaireNotification =
    await subscribe<ActionnaireNotification.SubscriptionEvent>({
      name: 'notifications',
      streamCategory: 'actionnaire',
      eventType: [
        'ActionnaireModifié-V1',
        'ChangementActionnaireDemandé-V1',
        'ChangementActionnaireAccordé-V1',
        'ChangementActionnaireRejeté-V1',
        'ChangementActionnaireAnnulé-V1',
        'ChangementActionnaireEnregistré-V1',
      ],
      eventHandler: async (event) =>
        mediator.publish<ActionnaireNotification.Execute>({
          type: 'System.Notification.Lauréat.Actionnaire',
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

  const unsubscribePuissanceSagaLauréat = await subscribe<
    Puissance.PuissanceSaga.SubscriptionEvent & Event
  >({
    name: 'puissance-laureat-saga',
    streamCategory: 'lauréat',
    eventType: ['LauréatNotifié-V2'],
    eventHandler: async (event) =>
      mediator.publish<Puissance.PuissanceSaga.Execute>({
        type: 'System.Lauréat.Puissance.Saga.Execute',
        data: event,
      }),
  });

  const unsubscribePuissanceSagaAbandon = await subscribe<
    Puissance.PuissanceSaga.SubscriptionEvent & Event
  >({
    name: 'puissance-abandon-saga',
    streamCategory: 'abandon',
    eventType: ['AbandonAccordé-V1'],
    eventHandler: async (event) =>
      mediator.publish<Puissance.PuissanceSaga.Execute>({
        type: 'System.Lauréat.Puissance.Saga.Execute',
        data: event,
      }),
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
    await unsubscribeAbandonProjector();
    await unsubscribeGarantiesFinancièresProjector();
    await unsubscribeAchèvementProjector();
    await unsubscribeReprésentantLégalProjector();
    await unsubscribeActionnaireProjector();
    await unsubscribePuissanceProjector();
    await unsubscribeProducteurProjector();
    await unsubscribeRaccordementProjector();
    // notifications
    await unsubscribeLauréatNotifications();
    await unsubscribeAbandonNotification();
    await unsubscribeGarantiesFinancièresNotification();
    await unsubscribeAchèvementNotification();
    await unsubscribeReprésentantLégalNotification();
    await unsubscribeActionnaireNotification();
    await unsubscribePuissanceNotification();
    await unsubscribeProducteurNotification();
    // sagas
    await unsubscribeGarantiesFinancièresSaga();
    await unsubscribeGarantiesFinancièresRecoursSaga();
    await unsubscribeGarantiesFinancièresProducteurSaga();
    await unsubscribeTypeGarantiesFinancièresSaga();
    await unsubscribeReprésentantLégalSagaLauréat();
    await unsubscribeReprésentantLégalSagaTâchePlanifiée();
    await unsubscribeReprésentantLégalSagaAbandon();
    await unsubscribeActionnaireSaga();
    await unsubscribeActionnaireSagaAbandon();
    await unsubscribeRaccordementAbandonSaga();
    await unsubscribeRaccordementLauréatSaga();
    await unsubscribePuissanceSagaLauréat();
    await unsubscribePuissanceSagaAbandon();
  };
};
