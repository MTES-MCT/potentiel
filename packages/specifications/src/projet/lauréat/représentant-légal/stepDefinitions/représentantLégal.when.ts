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
  /le DGEC validateur modifie le nom et le type du représentant légal(.*) pour le projet lauréat/,
  async function (this: PotentielWorld, avecLesMêmesValeurs?: string) {
    try {
      const options = avecLesMêmesValeurs?.includes('avec les mêmes valeurs')
        ? {
            nom: this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
              .nomReprésentantLégal,
            type: this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
              .typeReprésentantLégal,
          }
        : {
            nom: this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
              .nomReprésentantLégal,
            type: ReprésentantLégal.TypeReprésentantLégal.personnePhysique,
          };

      await modifierReprésentantLégal.call(this, options);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

type ModifierReprésentantLégalOptions = {
  nom?: string;
  type?: ReprésentantLégal.TypeReprésentantLégal.ValueType;
};
async function modifierReprésentantLégal(
  this: PotentielWorld,
  { nom, type }: ModifierReprésentantLégalOptions,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { nomReprésentantLégal, typeReprésentantLégal, dateModification } =
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
      dateModificationValue: dateModification,
    },
  });
}
