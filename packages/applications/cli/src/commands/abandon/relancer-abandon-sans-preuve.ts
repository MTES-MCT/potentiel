import { Command } from '@oclif/core';
import { mediator } from 'mediateur';
import z from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import {
  DocumentAdapter,
  getScopeProjetUtilisateurAdapter,
  ProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { getLogger } from '@potentiel-libraries/monitoring';

import { appSchema, dbSchema, throwIfEnvIsNotProduction } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
  ...appSchema.shape,
});

/***
 * @deprecated Cette commande ne peut pas marcher car au moment dans l'aggrégat abandon on détermine
 * une date limite de transmission de la preuve de recandidature (30/06/2025).
 *
 * Donc l'aggrégat va automatiquement throw DateLégaleTransmissionPreuveRecandidatureDépasséeError()
 * On conserve cette commande CLI temporairement le temps de trancher de la suppression de la feature
 */
export class Relancer extends Command {
  static monitoringSlug = 'relance-abandon-sans-preuve';

  async init() {
    envSchema.parse(process.env);

    Lauréat.registerLauréatQueries({
      find: findProjection,
      count: countProjection,
      getScopeProjetUtilisateur: getScopeProjetUtilisateurAdapter,
      list: listProjection,
      listHistory: listHistoryProjection,
    });

    Lauréat.registerLauréatUseCases({
      enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
      getProjetAggregateRoot: ProjetAdapter.getProjetAggregateRootAdapter,
    });
  }

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
        await mediator.send<Lauréat.Abandon.DemanderPreuveRecandidatureAbandonUseCase>({
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
