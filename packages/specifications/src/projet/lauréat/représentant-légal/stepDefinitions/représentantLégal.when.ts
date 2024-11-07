import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  /le représentant légal est importé pour le projet lauréat/,
  async function (this: PotentielWorld) {
    try {
      const identifiantProjetValue = this.lauréatWorld.identifiantProjet.formatter();

      const { importéLe } =
        this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture.créer();

      await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.ImporterReprésentantLégal',
        data: {
          identifiantProjetValue,
          importéLe,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
