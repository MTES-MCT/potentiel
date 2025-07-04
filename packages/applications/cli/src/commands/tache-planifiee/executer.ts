import { mediator } from 'mediateur';
import { Command, Flags } from '@oclif/core';
import z from 'zod';

import {
  ExécuterTâchePlanifiéeUseCase,
  ListerTâchesPlanifiéesQuery,
  registerTâchePlanifiéeQuery,
  registerTâchePlanifiéeUseCases,
} from '@potentiel-domain/tache-planifiee';
import { DateTime } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

import { getHealthcheckClient, HealthcheckClient } from '../../helpers/healthcheck';

const envSchema = z.object({
  APPLICATION_STAGE: z.string(),
  DATABASE_CONNECTION_STRING: z.string().url(),
  SENTRY_CRONS: z.string().optional(),
});

export class Executer extends Command {
  private healthcheckClient?: HealthcheckClient;
  static monitoringSlug = 'potentiel-scheduler';

  static flags = {
    date: Flags.string({
      default: DateTime.now().formatter(),
      description: 'Date des tâches plannifiées, au format YYYY-MM-DD',
    }),
  };

  async init() {
    const { APPLICATION_STAGE, SENTRY_CRONS } = envSchema.parse(process.env);
    if (!['production'].includes(APPLICATION_STAGE)) {
      console.log(`This job can't be executed on ${APPLICATION_STAGE} environment`);
      process.exit(0);
    }

    registerTâchePlanifiéeQuery({
      list: listProjection,
    });

    registerTâchePlanifiéeUseCases({
      loadAggregate,
    });

    this.healthcheckClient = getHealthcheckClient({
      healthcheckUrl: SENTRY_CRONS,
      slug: Executer.monitoringSlug,
      environment: APPLICATION_STAGE,
    });

    await this.healthcheckClient.start();
  }

  async finally(error: Error | undefined) {
    if (error) {
      await this.healthcheckClient?.error();
    } else {
      await this?.healthcheckClient?.success();
    }
  }

  async run() {
    const { flags } = await this.parse(Executer);
    const àExécuterLe = DateTime.convertirEnValueType(new Date(flags.date));
    const logger = getLogger('Scheduler');
    logger.info('Lancement du script...');

    const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
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
          await mediator.send<ExécuterTâchePlanifiéeUseCase>({
            type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
              typeTâchePlanifiéeValue: typeTâchePlanifiée,
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
