import { mediator } from 'mediateur';

import {
  registerCandidatureQueries,
  registerCandidaturesUseCases,
} from '@potentiel-domain/candidature';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureProjector } from '@potentiel-applications/projectors';
import { findProjection } from '@potentiel-infrastructure/pg-projections';

export const setupCandidature = async () => {
  registerCandidatureQueries({
    récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
    récupérerProjetsEligiblesPreuveRecanditure:
      CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
    récupérerProjets: CandidatureAdapter.récupérerProjetsAdapter,
  });

  registerCandidaturesUseCases({ loadAggregate });

  CandidatureProjector.register();

  const unsubscribeRecoursProjector = await subscribe<CandidatureProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: ['CandidatureImportée-V1', 'RebuildTriggered'],
    eventHandler: async (event) => {
      await mediator.send<CandidatureProjector.Execute>({
        type: 'System.Projector.Candidature',
        data: event,
      });
    },
    streamCategory: 'candidature',
  });

  return async () => {
    await unsubscribeRecoursProjector();
  };
};
