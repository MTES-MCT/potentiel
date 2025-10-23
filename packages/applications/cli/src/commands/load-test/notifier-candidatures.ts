import { Command, Flags } from '@oclif/core';
import zod from 'zod';
import { mediator } from 'mediateur';

import {
  Candidature,
  registerProjetQueries,
  registerProjetUseCases,
} from '@potentiel-domain/projet';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { DocumentAdapter, ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { DateTime, Email } from '@potentiel-domain/common';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { Période } from '@potentiel-domain/periode';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { registerUtilisateurUseCases } from '@potentiel-domain/utilisateur';

const envSchema = zod.object({
  APPLICATION_STAGE: zod.string(),
  DATABASE_CONNECTION_STRING: zod.url(),
});

export class NotifierCandidatures extends Command {
  static flags = {
    appelOffre: Flags.string({ options: appelsOffreData.map((ao) => ao.id), required: true }),
    periode: Flags.integer({ max: 100, required: true }),
  };

  async init() {
    const { APPLICATION_STAGE } = envSchema.parse(process.env);
    if (APPLICATION_STAGE === 'production') {
      console.log(`This job can't be executed on ${APPLICATION_STAGE} environment`);
      this.exit(1);
    }

    Période.registerPériodeUseCases({
      getProjetAggregateRoot: ProjetAdapter.getProjetAggregateRootAdapter,
      loadAggregate,
    });

    registerProjetQueries({
      count: countProjection,
      find: findProjection,
      list: listProjection,
      listHistory: listHistoryProjection,

      consulterABénéficiéDuDélaiCDC2022: async () => false,
      getScopeProjetUtilisateur: async () => ({ type: 'all' as const }),
      récupérerProjetsEligiblesPreuveRecanditure: async () => [],
    });

    registerUtilisateurUseCases({
      loadAggregate,
    });

    registerProjetUseCases({
      getProjetAggregateRoot: ProjetAdapter.getProjetAggregateRootAdapter,
      supprimerDocumentProjetSensible: DocumentAdapter.remplacerDocumentProjetSensible,
    });
  }

  async run() {
    console.log(`--- Début du job de notifications de candidatures ---`);
    const { flags } = await this.parse(NotifierCandidatures);
    const { appelOffre, periode } = flags;
    const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
      type: 'Candidature.Query.ListerCandidatures',
      data: {
        appelOffre,
        période: String(periode),
        estNotifiée: false,
      },
    });

    const start = process.hrtime.bigint();

    await mediator.send<Période.NotifierPériodeUseCase>({
      type: 'Période.UseCase.NotifierPériode',
      data: {
        identifiantCandidatureValues: candidatures.items.map((c) =>
          c.identifiantProjet.formatter(),
        ),
        identifiantPériodeValue: `${appelOffre}#${periode}`,
        notifiéeLeValue: DateTime.now().formatter(),
        notifiéeParValue: Email.système.formatter(),
        validateurValue: {
          fonction: 'Système',
          nomComplet: 'Système',
        },
      },
    });
    const end = process.hrtime.bigint();
    const durationTotal = Number(end - start) / 1_000_000;
    this.log(
      `Notification de ${candidatures.items.length} candidatures terminé en ${durationTotal.toFixed(2)}ms (${(
        durationTotal / candidatures.items.length
      ).toFixed(2)}ms/candidature)`,
    );
  }
}
