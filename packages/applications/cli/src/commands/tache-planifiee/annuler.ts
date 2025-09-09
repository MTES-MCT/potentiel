import { mediator } from 'mediateur';
import { Args, Command, Flags } from '@oclif/core';

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
      récupérerIdentifiantsProjetParEmailPorteur: () => {
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
