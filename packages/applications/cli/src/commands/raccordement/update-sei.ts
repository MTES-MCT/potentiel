import { Command, Flags } from '@oclif/core';
import { mediator } from 'mediateur';

import { Raccordement, registerRéseauUseCases } from '@potentiel-domain/reseau';
import { registerRéseauQueries } from '@potentiel-domain/reseau';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

registerRéseauQueries({
  count: countProjection,
  find: findProjection,
  list: listProjection,
});

registerRéseauUseCases({
  loadAggregate: loadAggregate,
});

export default class UpdateSEI extends Command {
  static override description = 'Mise à jour de tous les raccordements SEI sur le même GRD';

  static override args = {};

  static override flags = {
    dryRun: Flags.boolean({
      default: false,
      description: 'Exécution test, sans mise à jour',
    }),
  };

  public async run(): Promise<void> {
    console.info('Lancement du script...');
    const { flags } = await this.parse(UpdateSEI);

    let success = 0;

    const gestionnaires = [
      'EDF Archipel Guadeloupe',
      'EDF Corse',
      'EDF Guyane',
      'EDF Martinique',
      'EDF Réunion',
    ];
    for (const identifiantGestionnaireRéseauValue of gestionnaires) {
      const { items } = await mediator.send<Raccordement.ListerRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ListerRaccordement',
        data: { identifiantGestionnaireRéseauValue },
      });

      console.log(identifiantGestionnaireRéseauValue, items.length);

      const SEI = '23X160203-000021';

      for (const raccordement of items) {
        try {
          if (flags.dryRun) {
            console.log(
              `[DRY-RUN] Mise à jour du GRD pour le projet ${raccordement.identifiantProjet.formatter()}`,
            );
          } else {
            await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
              type: 'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
              data: {
                identifiantProjetValue: raccordement.identifiantProjet.formatter(),
                identifiantGestionnaireRéseauValue: SEI,
                rôleValue: 'admin',
              },
            });
          }
          success++;
        } catch (e) {
          console.warn(`Erreur mise à jour ${raccordement.identifiantProjet.formatter()}`, e);
        }
      }
    }
    console.log(`${success} raccordements mis à jour`);
    console.info('Fin du script ✨');

    process.exit(0);
  }
}
