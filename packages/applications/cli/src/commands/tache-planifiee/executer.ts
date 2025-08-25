import { mediator } from 'mediateur';
import { Command, Flags } from '@oclif/core';
import z from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  Lauréat,
  ProjetAggregateRoot,
  registerProjetQueries,
  registerProjetUseCases,
} from '@potentiel-domain/projet';
import { AppelOffreAdapter, DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';

const envSchema = z.object({
  APPLICATION_STAGE: z.string(),
  DATABASE_CONNECTION_STRING: z.string().url(),
});

export class Executer extends Command {
  static monitoringSlug = 'potentiel-scheduler';

  static flags = {
    date: Flags.string({
      default: DateTime.now().formatter(),
      description: 'Date des tâches plannifiées, au format YYYY-MM-DD',
    }),
  };

  async init() {
    registerProjetQueries({
      list: listProjection,
      find: findProjection,
      count: countProjection,
      listHistory: listHistoryProjection,
      consulterABénéficiéDuDélaiCDC2022: () => {
        throw new Error('notImplemented');
      },
      getScopeProjetUtilisateur: () => {
        throw new Error('notImplemented');
      },
      récupérerProjetsEligiblesPreuveRecanditure: () => {
        throw new Error('notImplemented');
      },
    });
    registerProjetUseCases({
      getProjetAggregateRoot: (identifiantProjet) =>
        ProjetAggregateRoot.get(identifiantProjet, {
          loadAggregate: loadAggregateV2,
          loadAppelOffreAggregate: AppelOffreAdapter.loadAppelOffreAggregateAdapter,
        }),
      supprimerDocumentProjetSensible: DocumentAdapter.remplacerDocumentProjetSensible,
    });
  }

  async run() {
    const { APPLICATION_STAGE } = envSchema.parse(process.env);
    if (!['production'].includes(APPLICATION_STAGE)) {
      console.log(`This job can't be executed on ${APPLICATION_STAGE} environment`);
      return;
    }

    const { flags } = await this.parse(Executer);
    const àExécuterLe = DateTime.convertirEnValueType(new Date(flags.date));
    const logger = getLogger('Scheduler');
    logger.info('Lancement du script...');

    const tâches = await mediator.send<Lauréat.TâchePlanifiée.ListerTâchesPlanifiéesQuery>({
      type: 'Tâche.Query.ListerTâchesPlanifiées',
      data: {
        àExécuterLe: àExécuterLe.formatter(),
      },
    });

    logger.info(
      `Il y a ${tâches.items.length} tâches à exécuter le ${àExécuterLe.formatterDate()}`,
    );

    await Promise.all(
      tâches.items.map(async ({ identifiantProjet, typeTâchePlanifiée }) => {
        try {
          logger.info(`Exécution de ${typeTâchePlanifiée} pour ${identifiantProjet.formatter()}`);
          await mediator.send<Lauréat.TâchePlanifiée.ExécuterTâchePlanifiéeUseCase>({
            type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
              typeTâchePlanifiéeValue: typeTâchePlanifiée,
              exécutéeLe: DateTime.now().formatter(),
            },
          });
        } catch (e) {
          logger.warn(`Error lors de l'execution de la tâche planifiée`, {
            typeTâchePlanifiée,
            identifiantProjet: identifiantProjet.formatter(),
            error: (e as Error).message,
          });
        }
      }),
    );

    logger.info('Fin du script ✨');
  }
}
