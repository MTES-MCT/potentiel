import { Command, Flags, getLogger } from '@oclif/core';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat, ProjetAggregateRoot } from '@potentiel-domain/projet';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import { AppelOffreAdapter } from '@potentiel-infrastructure/domain-adapters';

export class AcheverTâche extends Command {
  static flags = {
    projet: Flags.string({ char: 'p', description: 'identifiant du projet', required: true }),
    type: Flags.string({ char: 't', description: 'type de tâche', required: true }),
  };
  async init() {
    Lauréat.Tâche.registerTâcheUseCases({
      getProjetAggregateRoot: (identifiant) =>
        ProjetAggregateRoot.get(identifiant, {
          loadAggregate: loadAggregateV2,
          loadAppelOffreAggregate: AppelOffreAdapter.loadAppelOffreAggregateAdapter,
        }),
    });
  }

  async run() {
    const { flags } = await this.parse(AcheverTâche);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(flags.projet);
    const typeTâche = Lauréat.Tâche.TypeTâche.convertirEnValueType(flags.type);
    await mediator.send<Lauréat.Tâche.AcheverTâcheCommand>({
      type: 'System.Tâche.Command.AcheverTâche',
      data: {
        identifiantProjet,
        typeTâche,
      },
    });
    getLogger().info('Tâche achevée', {
      identifiantProjet: identifiantProjet.formatter(),
      typeTâche: typeTâche.type,
    });
  }
}
