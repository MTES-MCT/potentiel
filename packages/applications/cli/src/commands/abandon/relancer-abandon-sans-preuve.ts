import { Command } from '@oclif/core';
import { mediator } from 'mediateur';
import z from 'zod';

import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { appSchema, dbSchema, throwIfEnvIsNotProduction } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
  ...appSchema.shape,
});

export class Relancer extends Command {
  static monitoringSlug = 'relance-abandon-sans-preuve';

  async run() {
    const { APPLICATION_STAGE } = envSchema.parse(process.env);

    throwIfEnvIsNotProduction(APPLICATION_STAGE);

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
