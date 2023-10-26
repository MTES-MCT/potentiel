import { Message, mediator } from 'mediateur';
import { getLogger } from '@potentiel/monitoring';
import { registerCandidatureQueries } from '@potentiel-domain/candidature';
import { registerLauréatQueries, registerLauréatUseCases } from '@potentiel-domain/laureat';
import {
  registerDocumentProjetCommand,
  registerDocumentProjetQueries,
} from '@potentiel-domain/document';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureAdapter, DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';
import { logMiddleware } from '@potentiel-libraries/mediateur-middlewares';

let isBoostrapped = false;

export const bootstrap = () => {
  if (!isBoostrapped) {
    mediator.use<Message>({
      middlewares: [logMiddleware],
    });

    registerCandidatureQueries({
      récupérerCandidature: CandidatureAdapter.récupérerCandidatureAdapter,
    });

    registerLauréatUseCases({
      loadAggregate,
    });

    registerLauréatQueries({
      find: findProjection,
      list: listProjection,
    });

    registerDocumentProjetQueries({
      récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
    });

    registerDocumentProjetCommand({
      enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
    });

    getLogger().info('Application bootstrapped');
    isBoostrapped = true;
  }
};
