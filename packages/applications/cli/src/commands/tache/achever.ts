import { Command, Flags, getLogger } from '@oclif/core';
import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { registerTâcheCommand, Tâche } from '@potentiel-domain/tache';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

export class AcheverTâche extends Command {
  static flags = {
    projet: Flags.string({ char: 'p', description: 'identifiant du projet', required: true }),
    type: Flags.string({ char: 't', description: 'type de tâche', required: true }),
  };
  async init() {
    registerTâcheCommand({ loadAggregate });
  }

  async run() {
    const { flags } = await this.parse(AcheverTâche);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(flags.projet);
    const typeTâche = Tâche.TypeTâche.convertirEnValueType(flags.type);
    await mediator.send<Tâche.AcheverTâcheCommand>({
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
