import { createSubscriptionSetup } from '@potentiel-applications/subscribers';
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
 * Synchronisation des événements issus de la nouvelle app vers le legacy
 */
export const registerSagas = async () => {
  const abandon = createSubscriptionSetup('abandon');
  AbandonSaga.register();
  await abandon.setupSubscription<AbandonSaga.SubscriptionEvent, AbandonSaga.Execute>({
    name: 'legacy-saga',
    eventType: ['AbandonAccordé-V1'],
    messageType: 'System.Saga.Abandon',
  });

  const candidature = createSubscriptionSetup('candidature');
  CandidatureSaga.register();
  await candidature.setupSubscription<CandidatureSaga.SubscriptionEvent, CandidatureSaga.Execute>({
    name: 'legacy-saga',
    eventType: ['CandidatureImportée-V2', 'CandidatureCorrigée-V2'],
    messageType: 'System.Saga.Candidature',
  });

  const lauréat = createSubscriptionSetup('lauréat');
  LauréatSaga.register();
  await lauréat.setupSubscription<LauréatSaga.SubscriptionEvent, LauréatSaga.Execute>({
    name: 'legacy-saga',
    eventType: [
      'LauréatNotifié-V2',
      'NomProjetModifié-V1',
      'SiteDeProductionModifié-V1',
      'CahierDesChargesChoisi-V1',
      'ChangementNomProjetEnregistré-V1',
    ],
    messageType: 'System.Saga.Lauréat',
  });

  const éliminé = createSubscriptionSetup('éliminé');
  ÉliminéSaga.register();
  await éliminé.setupSubscription<ÉliminéSaga.SubscriptionEvent, ÉliminéSaga.Execute>({
    name: 'legacy-saga',
    eventType: ['ÉliminéNotifié-V1'],
    messageType: 'System.Saga.Éliminé',
  });

  const actionnaire = createSubscriptionSetup('actionnaire');
  ActionnaireSaga.register();
  await actionnaire.setupSubscription<ActionnaireSaga.SubscriptionEvent, ActionnaireSaga.Execute>({
    name: 'legacy-saga',
    eventType: [
      'ActionnaireModifié-V1',
      'ChangementActionnaireAccordé-V1',
      'ChangementActionnaireEnregistré-V1',
    ],
    messageType: 'System.Saga.Actionnaire',
  });

  const accès = createSubscriptionSetup('accès');
  AccèsSaga.register();
  await accès.setupSubscription<AccèsSaga.SubscriptionEvent, AccèsSaga.Execute>({
    name: 'legacy-saga',
    eventType: ['AccèsProjetAutorisé-V1', 'AccèsProjetRetiré-V1'],
    messageType: 'System.Saga.Accès',
  });

  const utilisateur = createSubscriptionSetup('utilisateur');
  UtilisateurSaga.register();
  await utilisateur.setupSubscription<UtilisateurSaga.SubscriptionEvent, UtilisateurSaga.Execute>({
    name: 'legacy-saga',
    eventType: ['UtilisateurInvité-V2'],
    messageType: 'System.Saga.Utilisateur',
  });

  const puissance = createSubscriptionSetup('puissance');
  PuissanceSaga.register();
  await puissance.setupSubscription<PuissanceSaga.SubscriptionEvent, PuissanceSaga.Execute>({
    name: 'legacy-saga',
    eventType: [
      'PuissanceModifiée-V1',
      'ChangementPuissanceEnregistré-V1',
      'ChangementPuissanceAccordé-V1',
    ],
    messageType: 'System.Saga.Puissance',
  });

  const producteur = createSubscriptionSetup('producteur');
  ProducteurSaga.register();
  await producteur.setupSubscription<ProducteurSaga.SubscriptionEvent, ProducteurSaga.Execute>({
    name: 'legacy-saga',
    eventType: ['ProducteurModifié-V1', 'ChangementProducteurEnregistré-V1'],
    messageType: 'System.Saga.Producteur',
  });

  const fournisseur = createSubscriptionSetup('fournisseur');
  FournisseurSaga.register();
  await fournisseur.setupSubscription<FournisseurSaga.SubscriptionEvent, FournisseurSaga.Execute>({
    name: 'legacy-saga',
    eventType: ['ÉvaluationCarboneSimplifiéeModifiée-V1', 'ChangementFournisseurEnregistré-V1'],
    messageType: 'System.Saga.Fournisseur',
  });

  const achèvement = createSubscriptionSetup('achevement');
  AchèvementSaga.register();
  await achèvement.setupSubscription<AchèvementSaga.SubscriptionEvent, AchèvementSaga.Execute>({
    name: 'legacy-saga',
    eventType: ['DateAchèvementPrévisionnelCalculée-V1'],
    messageType: 'System.Saga.Achèvement',
  });

  return async () => {
    await abandon.clearSubscriptions();
    await candidature.clearSubscriptions();
    await lauréat.clearSubscriptions();
    await éliminé.clearSubscriptions();
    await actionnaire.clearSubscriptions();
    await utilisateur.clearSubscriptions();
    await puissance.clearSubscriptions();
    await producteur.clearSubscriptions();
    await accès.clearSubscriptions();
    await fournisseur.clearSubscriptions();
    await achèvement.clearSubscriptions();
  };
};
