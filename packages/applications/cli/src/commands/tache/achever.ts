import { Command, Flags } from '@oclif/core';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getProjetAggregateRootAdapter } from '@potentiel-infrastructure/domain-adapters';

export class AcheverTâche extends Command {
  static flags = {
    projet: Flags.string({ char: 'p', description: 'identifiant du projet', required: true }),
    type: Flags.string({ char: 't', description: 'type de tâche', required: true }),
  };

  async run() {
    const { flags } = await this.parse(AcheverTâche);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(flags.projet);
    const typeTâche = Lauréat.Tâche.TypeTâche.convertirEnValueType(flags.type);

    const projet = await getProjetAggregateRootAdapter(identifiantProjet);

    const tâche = await projet.lauréat.loadTâche(typeTâche.type);

    await tâche.achever();
  }
}
