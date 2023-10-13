import { registerQueries } from '@potentiel/domain-views';
import { getLogger } from '@potentiel/monitoring';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  searchProjection,
  updateProjection,
  upsertProjection,
} from '@potentiel/pg-projections';
import {
  récupérerCandidatureAdapter,
  téléchargerPièceJustificativeAbandonProjetAdapter,
  téléchargerRéponseSignéeAdapter,
  téléverserPièceJustificativeAbandonAdapter,
  téléverserRéponseSignéeAdapter,
} from '@potentiel/infra-adapters';
import { publish, loadAggregate } from '@potentiel/pg-event-sourcing';
import { Message, mediator } from 'mediateur';
import { randomUUID } from 'crypto';
import { registerUsecases as registerUseCases } from '@potentiel/domain';

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

    registerQueries({
      common: {
        create: createProjection,
        find: findProjection,
        list: listProjection,
        remove: removeProjection,
        search: searchProjection,
        update: updateProjection,
        upsert: upsertProjection,
      },
      projet: {
        récupérerCandidature: récupérerCandidatureAdapter,
        récupérerPièceJustificativeAbandon: téléchargerPièceJustificativeAbandonProjetAdapter,
        récupérerRéponseSignée: téléchargerRéponseSignéeAdapter,
      },
    });

    registerUseCases({
      common: {
        loadAggregate,
        publish,
      },
      projet: {
        enregistrerPièceJustificativeAbandon: téléverserPièceJustificativeAbandonAdapter,
        enregistrerRéponseSignée: téléverserRéponseSignéeAdapter,
      },
    });
    isBoostrapped = true;
  }
};
