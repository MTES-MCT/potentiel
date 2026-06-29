import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import type { PotentielWorld } from '../../../../potentiel.world.js';

Quand(
  'le DGEC validateur modifie le nom et le type du représentant légal',
  async function (this: PotentielWorld) {
    const { nomReprésentantLégal } =
      this.lauréatWorld.représentantLégalWorld.modifierReprésentantLégalFixture.créer({});

    await modifierReprésentantLégal.call(this, {
      nom: nomReprésentantLégal,
      type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.personnePhysique,
    });
  },
);

Quand(
  'le DGEC validateur modifie le nom et le type du représentant légal avec les mêmes valeurs',
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet;
    const { nomReprésentantLégal, typeReprésentantLégal } =
      this.lauréatWorld.représentantLégalWorld.mapToExpected(
        identifiantProjet,
        this.candidatureWorld.importerCandidature.aÉtéCréé
          ? this.candidatureWorld.importerCandidature.dépôtValue.nomReprésentantLégal
          : '',
      );

    await modifierReprésentantLégal.call(this, {
      nom: nomReprésentantLégal,
      type: typeReprésentantLégal,
    });
  },
);

Quand(
  'le DGEC validateur modifie le représentant légal avec le même nom',
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet;
    const { nomReprésentantLégal } = this.lauréatWorld.représentantLégalWorld.mapToExpected(
      identifiantProjet,
      this.candidatureWorld.importerCandidature.aÉtéCréé
        ? this.candidatureWorld.importerCandidature.values.nomReprésentantLégalValue
        : '',
    );

    await modifierReprésentantLégal.call(this, {
      nom: nomReprésentantLégal,
      type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.personnePhysique,
    });
  },
);

type ModifierReprésentantLégalOptions = {
  nom?: string;
  type?: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
};
async function modifierReprésentantLégal(
  this: PotentielWorld,
  { nom, type }: ModifierReprésentantLégalOptions,
) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { nomReprésentantLégal, typeReprésentantLégal, dateModification, raison } =
      this.lauréatWorld.représentantLégalWorld.modifierReprésentantLégalFixture.créer(
        nom && type
          ? {
              nomReprésentantLégal: nom,
              typeReprésentantLégal: type,
            }
          : {},
      );

    await mediator.send<Lauréat.ReprésentantLégal.ModifierReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: this.utilisateurWorld.dgecFixture.email,
        nomReprésentantLégalValue: nomReprésentantLégal,
        typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
        dateModificationValue: dateModification,
        raisonValue: raison,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
