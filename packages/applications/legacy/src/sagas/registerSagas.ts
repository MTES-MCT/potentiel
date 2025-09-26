import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { mediator } from 'mediateur';
import * as AbandonSaga from './abandon.saga';
import * as AccèsSaga from './accès.saga';
import * as ActionnaireSaga from './actionnaire.saga';
import * as CandidatureSaga from './candidature.saga';
import * as LauréatSaga from './lauréat.saga';
import * as ProducteurSaga from './producteur.saga';
import * as PuissanceSaga from './puissance.saga';
import * as UtilisateurSaga from './utilisateur.saga';
import * as ÉliminéSaga from './éliminé.saga';
import * as FournisseurSaga from './fournisseur.saga';
import * as AchèvementSaga from './achèvement.saga';

/**
 * @deprecated à bouger dans la nouvelle app
 */
export const registerSagas = async () => {
  AbandonSaga.register();
  CandidatureSaga.register();
  LauréatSaga.register();
  ÉliminéSaga.register();
  ActionnaireSaga.register();
  UtilisateurSaga.register();
  PuissanceSaga.register();
  ProducteurSaga.register();
  AccèsSaga.register();
  FournisseurSaga.register();
  AchèvementSaga.register();

  const unsubscribeAbandon = await subscribe<AbandonSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: ['AbandonAccordé-V1'],
    eventHandler: async (event) => {
      await mediator.send<AbandonSaga.Execute>({
        type: 'System.Saga.Abandon',
        data: event,
      });
    },
    streamCategory: 'abandon',
  });

  const unsubscribeCandidature = await subscribe<CandidatureSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: ['CandidatureImportée-V2', 'CandidatureCorrigée-V2'],
    eventHandler: async (event) => {
      await mediator.send<CandidatureSaga.Execute>({
        type: 'System.Saga.Candidature',
        data: event,
      });
    },
    streamCategory: 'candidature',
  });

  const unsubscribeLauréat = await subscribe<LauréatSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: [
      'LauréatNotifié-V2',
      'NomProjetModifié-V1',
      'SiteDeProductionModifié-V1',
      'CahierDesChargesChoisi-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<LauréatSaga.Execute>({
        type: 'System.Saga.Lauréat',
        data: event,
      });
    },
    streamCategory: 'lauréat',
  });

  const unsubscribeÉliminé = await subscribe<ÉliminéSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: ['ÉliminéNotifié-V1'],
    eventHandler: async (event) => {
      await mediator.send<ÉliminéSaga.Execute>({
        type: 'System.Saga.Éliminé',
        data: event,
      });
    },
    streamCategory: 'éliminé',
  });

  const unsubscribeActionnaire = await subscribe<ActionnaireSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: [
      'ActionnaireModifié-V1',
      'ChangementActionnaireAccordé-V1',
      'ChangementActionnaireEnregistré-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<ActionnaireSaga.Execute>({
        type: 'System.Saga.Actionnaire',
        data: event,
      });
    },
    streamCategory: 'actionnaire',
  });

  const unsubscribeAccès = await subscribe<AccèsSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: ['AccèsProjetAutorisé-V1', 'AccèsProjetRetiré-V1'],
    eventHandler: async (event) => {
      await mediator.send<AccèsSaga.Execute>({
        type: 'System.Saga.Accès',
        data: event,
      });
    },
    streamCategory: 'accès',
  });

  const unsubscribeUtilisateur = await subscribe<UtilisateurSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: ['UtilisateurInvité-V1'],
    eventHandler: async (event) => {
      await mediator.send<UtilisateurSaga.Execute>({
        type: 'System.Saga.Utilisateur',
        data: event,
      });
    },
    streamCategory: 'utilisateur',
  });

  const unsubscribePuissance = await subscribe<PuissanceSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: [
      'PuissanceModifiée-V1',
      'ChangementPuissanceEnregistré-V1',
      'ChangementPuissanceAccordé-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<PuissanceSaga.Execute>({
        type: 'System.Saga.Puissance',
        data: event,
      });
    },
    streamCategory: 'puissance',
  });

  const unsubscribeProducteur = await subscribe<ProducteurSaga.SubscriptionEvent>({
    name: 'legacy-saga-producteur',
    eventType: ['ProducteurModifié-V1', 'ChangementProducteurEnregistré-V1'],
    eventHandler: async (event) => {
      await mediator.send<ProducteurSaga.Execute>({
        type: 'System.Saga.Producteur',
        data: event,
      });
    },
    streamCategory: 'producteur',
  });

  const unsubscribeFournisseur = await subscribe<FournisseurSaga.SubscriptionEvent>({
    name: 'legacy-saga-fournisseur',
    eventType: ['ÉvaluationCarboneSimplifiéeModifiée-V1', 'ChangementFournisseurEnregistré-V1'],
    eventHandler: async (event) => {
      await mediator.send<FournisseurSaga.Execute>({
        type: 'System.Saga.Fournisseur',
        data: event,
      });
    },
    streamCategory: 'fournisseur',
  });

  const unsubscribeAchèvement = await subscribe<AchèvementSaga.SubscriptionEvent>({
    name: 'legacy-saga-achevement',
    eventType: ['DateAchèvementPrévisionnelCalculée-V1'],
    eventHandler: async (event) => {
      await mediator.send<AchèvementSaga.Execute>({
        type: 'System.Saga.Achèvement',
        data: event,
      });
    },
    streamCategory: 'achevement',
  });

  return async () => {
    await unsubscribeAbandon();
    await unsubscribeCandidature();
    await unsubscribeLauréat();
    await unsubscribeÉliminé();
    await unsubscribeActionnaire();
    await unsubscribeUtilisateur();
    await unsubscribePuissance();
    await unsubscribeProducteur();
    await unsubscribeAccès();
    await unsubscribeFournisseur();
    await unsubscribeAchèvement();
  };
};
