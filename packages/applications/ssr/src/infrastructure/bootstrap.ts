import { Message, mediator } from 'mediateur';
import { randomUUID } from 'crypto';
import { getLogger } from '@potentiel/monitoring';
import { registerLauréatQueries, registerLauréatUseCases } from '@potentiel-domain/laureat';
import {
  registerDocumentProjetCommand,
  registerDocumentProjetQueries,
} from '@potentiel-domain/document';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { publish, loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';

let isBoostrapped = false;

export const bootstrap = () => {
  if (!isBoostrapped) {
    mediator.use<Message>({
      middlewares: [
        async (message, next) => {
          const correlationId = randomUUID();
          getLogger().info('Executing message', {
            message: JSON.stringify(message),
            correlationId,
          });
          try {
            const result = await next();
            getLogger().info('Message executed', { result: JSON.stringify(result), correlationId });
            return result;
          } catch (e) {
            getLogger().error(e as Error, { result: JSON.stringify(e), correlationId });
            throw e;
          }
        },
      ],
    });

    registerLauréatUseCases({
      loadAggregate,
      publish,
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
