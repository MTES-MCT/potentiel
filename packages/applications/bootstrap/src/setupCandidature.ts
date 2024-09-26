import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Event, loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureProjector } from '@potentiel-applications/projectors';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { AttestationSaga } from '@potentiel-applications/document-builder';

export const setupCandidature = async () => {
  Candidature.registerCandidaturesUseCases({ loadAggregate });

  Candidature.registerCandidatureQueries({
    find: findProjection,
    récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
    récupérerProjetsEligiblesPreuveRecanditure:
      CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
    récupérerProjets: CandidatureAdapter.récupérerProjetsAdapter,
    list: listProjection,
  });

  CandidatureProjector.register();

  const unsubscribeCandidatureProjector = await subscribe<CandidatureProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'CandidatureImportée-V1',
      'CandidatureCorrigée-V1',
      'CandidatureNotifiée-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<CandidatureProjector.Execute>({
        type: 'System.Projector.Candidature',
        data: event,
      });
    },
    streamCategory: 'candidature',
  });

  const unsubscribeAttestationSaga = await subscribe<AttestationSaga.SubscriptionEvent & Event>({
    name: 'attestation-saga',
    streamCategory: 'candidature',
    eventType: ['CandidatureNotifiée-V1'],
    eventHandler: async (event) => {
      await mediator.publish<AttestationSaga.Execute>({
        type: 'System.Candidature.Attestation.Saga.Execute',
        data: event,
      });
    },
  });

  return async () => {
    await unsubscribeCandidatureProjector();
    await unsubscribeAttestationSaga();
  };
};
