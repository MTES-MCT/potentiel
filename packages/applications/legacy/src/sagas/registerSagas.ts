import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import * as RaccordementSaga from './raccordement.saga';
import * as AbandonSaga from './abandon.saga';
import * as CandidatureSaga from './candidature.saga';
import * as LauréatSaga from './lauréat.saga';
import * as ÉliminéSaga from './éliminé.saga';
import * as ActionnaireSaga from './actionnaire.saga';
import * as UtilisateurSaga from './utilisateur.saga';
import { mediator } from 'mediateur';

/**
 * @deprecated à bouger dans la nouvelle app
 */
export const registerSagas = async () => {
  RaccordementSaga.register();
  AbandonSaga.register();
  CandidatureSaga.register();
  LauréatSaga.register();
  ÉliminéSaga.register();
  ActionnaireSaga.register();
  UtilisateurSaga.register();
  const unsubscribeRaccordement = await subscribe<RaccordementSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: [
      'DateMiseEnServiceTransmise-V1',
      'DateMiseEnServiceTransmise-V2',
      'DemandeComplèteDeRaccordementTransmise-V2',
    ],
    eventHandler: async (event) => {
      await mediator.send<RaccordementSaga.Execute>({
        type: 'System.Saga.Raccordement',
        data: event,
      });
    },
    streamCategory: 'raccordement',
  });

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
    eventType: ['CandidatureImportée-V1', 'CandidatureCorrigée-V1'],
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
    eventType: ['LauréatNotifié-V2', 'LauréatModifié-V1'],
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

  const unsubscribeUtilisateur = await subscribe<UtilisateurSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: [
      'PorteurInvité-V1',
      'ProjetRéclamé-V1',
      'AccèsProjetRetiré-V1',
      'UtilisateurInvité-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<UtilisateurSaga.Execute>({
        type: 'System.Saga.Utilisateur',
        data: event,
      });
    },
    streamCategory: 'utilisateur',
  });

  return async () => {
    await unsubscribeRaccordement();
    await unsubscribeAbandon();
    await unsubscribeCandidature();
    await unsubscribeLauréat();
    await unsubscribeÉliminé();
    await unsubscribeActionnaire();
    await unsubscribeUtilisateur();
  };
};
