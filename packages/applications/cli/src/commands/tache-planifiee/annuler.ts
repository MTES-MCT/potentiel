import { mediator } from 'mediateur';
import { Args, Command, Flags } from '@oclif/core';

import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { Lauréat, registerProjetQueries, registerProjetUseCases } from '@potentiel-domain/projet';
import {
  DocumentAdapter,
  getProjetAggregateRootAdapter,
} from '@potentiel-infrastructure/domain-adapters';

export class Annuler extends Command {
  static flags = {
    type: Flags.string({
      desc: 'Type de la Tâche Planifiée à annuler',
      required: true,
    }),
  };
  static args = {
    identifiantProjet: Args.string({
      description: 'Identifiant du projet',
      required: true,
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
      getProjetAggregateRoot: getProjetAggregateRootAdapter,
      supprimerDocumentProjetSensible: DocumentAdapter.remplacerDocumentProjetSensible,
    });
  }

  async run() {
    const { flags, args } = await this.parse(Annuler);

    await mediator.send<Lauréat.TâchePlanifiée.AnnulerTâchePlanifiéeUseCase>({
      type: 'System.TâchePlanifiée.UseCase.AnnulerTâchePlanifiée',
      data: {
        identifiantProjetValue: args.identifiantProjet,
        typeTâchePlanifiéeValue: flags.type,
      },
    });
  }
}
