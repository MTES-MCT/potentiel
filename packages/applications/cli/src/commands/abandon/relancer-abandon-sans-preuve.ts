import { mediator } from 'mediateur';
import { Command } from '@oclif/core';
import z from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { registerLauréatQueries, registerLauréatUseCases } from '@potentiel-domain/laureat';
import {
  AppelOffreAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { loadAggregate, loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Lauréat, ProjetAggregateRoot } from '@potentiel-domain/projet';
import { killPool } from '@potentiel-libraries/pg-helpers';

const envSchema = z.object({
  APPLICATION_STAGE: z.string(),
  DATABASE_CONNECTION_STRING: z.string().url(),
});
export class Relancer extends Command {
  async init() {
    const { APPLICATION_STAGE } = envSchema.parse(process.env);
    if (!['production', 'development'].includes(APPLICATION_STAGE)) {
      console.log(`This job can't be executed on ${APPLICATION_STAGE} environment`);
      process.exit(0);
    }

    registerLauréatQueries({
      find: findProjection,
      list: listProjection,
      récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
      count: countProjection,
    });

    registerLauréatUseCases({
      loadAggregate,
      getProjetAggregateRoot: (identifiantProjet) =>
        ProjetAggregateRoot.get(identifiantProjet, {
          loadAggregate: loadAggregateV2,
          loadAppelOffreAggregate: AppelOffreAdapter.loadAppelOffreAggregateAdapter,
        }),
    });
  }

  protected async finally(_: Error | undefined) {
    await killPool();
  }

  async run() {
    const abandonsÀRelancer =
      await mediator.send<Lauréat.Abandon.ListerAbandonsAvecRecandidatureÀRelancerQuery>({
        type: 'Lauréat.Abandon.Query.ListerAbandonsAvecRecandidatureÀRelancer',
        data: {},
      });

    getLogger().info(`${abandonsÀRelancer.résultats.length} abandons à relancer`);
    let errors = 0;
    for (const { identifiantProjet } of abandonsÀRelancer.résultats) {
      try {
        await mediator.send<Lauréat.Abandon.AbandonUseCase>({
          type: 'Lauréat.Abandon.UseCase.DemanderPreuveRecandidatureAbandon',
          data: {
            dateDemandeValue: DateTime.now().formatter(),
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

        process.exit(0);
      } catch (e) {
        errors++;
        getLogger().error(e as Error);
      }
    }

    if (errors) {
      throw new Error('Some error(s) occurred');
    }
  }
}
