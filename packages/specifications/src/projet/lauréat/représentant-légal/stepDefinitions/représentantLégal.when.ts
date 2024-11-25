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
  `le nom et le type du représentant légal du projet lauréat sont modifiés`,
  async function (this: PotentielWorld) {
    try {
      await modifierReprésentantLégal.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
Quand(
  `le nom et le type du représentant légal du projet lauréat sont modifiés avec les même valeur`,
  async function (this: PotentielWorld) {
    try {
      await modifierReprésentantLégal.call(
        this,
        this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
          .nomReprésentantLégal,
        this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
          .typeReprésentantLégal,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function modifierReprésentantLégal(
  this: PotentielWorld,
  nom?: string,
  type?: ReprésentantLégal.TypeReprésentantLégal.ValueType,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { nomReprésentantLégal, typeReprésentantLégal, dateCorrection } =
    this.lauréatWorld.représentantLégalWorld.modifierReprésentantLégalFixture.créer(
      nom && type
        ? {
            nomReprésentantLégal: nom,
            typeReprésentantLégal: type,
          }
        : {},
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
