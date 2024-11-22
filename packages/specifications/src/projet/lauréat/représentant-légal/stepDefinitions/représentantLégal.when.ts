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
  /le nom du représentant légal du projet lauréat est modifié(.*)/,
  async function (this: PotentielWorld, avecLamêmeValeur: string) {
    try {
      await corrigerReprésentantLégal.call(
        this,
        avecLamêmeValeur.includes('avec la même valeur')
          ? this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
              .nomReprésentantLégal
          : undefined,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function corrigerReprésentantLégal(this: PotentielWorld, nom?: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { nomReprésentantLégal, typeReprésentantLégal, dateCorrection } =
    this.lauréatWorld.représentantLégalWorld.corrigerReprésentantLégalFixture.créer(
      nom ? { nomReprésentantLégal: nom } : {},
    );

  await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
    type: 'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: this.utilisateurWorld.adminFixture.email,
      nomReprésentantLégalValue: nomReprésentantLégal,
      typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
      dateModificationValue: dateCorrection,
    },
  });
}
