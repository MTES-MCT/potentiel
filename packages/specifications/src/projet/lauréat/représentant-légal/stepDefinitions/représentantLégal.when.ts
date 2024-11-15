import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';

import { importerReprésentantLégal } from './représentantLégal.given';

Quand(
  /le représentant légal est importé pour le projet lauréat/,
  async function (this: PotentielWorld) {
    try {
      await importerReprésentantLégal.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  /le nom du représentant légal du projet lauréat est corrigé/,
  async function (this: PotentielWorld) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

      const { nomReprésentantLégal, dateCorrection } =
        this.lauréatWorld.représentantLégalWorld.corrigerReprésentantLégalFixture.créer();

      await mediator.send<ReprésentantLégal.CorrigerReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.CorrigerReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: this.utilisateurWorld.adminFixture.email,
          nomReprésentantLégalValue: nomReprésentantLégal,
          dateCorrectionValue: dateCorrection,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
