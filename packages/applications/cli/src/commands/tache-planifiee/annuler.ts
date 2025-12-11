import { Command, Flags } from '@oclif/core';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';

export class Annuler extends Command {
  static flags = {
    projet: Flags.string({ char: 'p', description: 'identifiant du projet', required: true }),
    type: Flags.string({
      char: 't',
      description: 'type de tâche planifiée à annuler',
      required: true,
    }),
  };

  async run() {
    const { flags } = await this.parse(Annuler);

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(flags.projet);

    const projet = await ProjetAdapter.getProjetAggregateRootAdapter(identifiantProjet);

    const tâchePlanifiée = await projet.lauréat.loadTâchePlanifiée(flags.type);

    await tâchePlanifiée.annuler();
  }
}
