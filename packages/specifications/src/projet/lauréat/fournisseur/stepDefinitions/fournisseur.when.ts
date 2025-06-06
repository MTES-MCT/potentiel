import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert } from 'chai';

import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  "un administrateur modifie l'évaluation carbone du projet",
  async function (this: PotentielWorld) {
    await modifierÉvaluationCarbone.call(this);
  },
);

Quand(
  "un administrateur modifie l'évaluation carbone du projet avec :",
  async function (this: PotentielWorld, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await modifierÉvaluationCarbone.call(
      this,
      this.lauréatWorld.fournisseurWorld.mapExempleToFixtureValues(exemple),
    );
  },
);

Quand(
  "un administrateur modifie l'évaluation carbone du projet avec la même valeur",
  async function (this: PotentielWorld) {
    const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
      type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
      data: {
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });
    assert(Option.isSome(fournisseur), 'Fournisseur non trouvé');

    await modifierÉvaluationCarbone.call(this, {
      évaluationCarbone: fournisseur.évaluationCarboneSimplifiée,
    });
  },
);

export async function modifierÉvaluationCarbone(
  this: PotentielWorld,
  values: {
    évaluationCarbone?: number;
  } = {},
) {
  try {
    const { modifiéeLe, modifiéePar, évaluationCarbone } =
      this.lauréatWorld.fournisseurWorld.modifierÉvaluationCarbone.créer({
        modifiéePar: this.utilisateurWorld.adminFixture.email,
        ...values,
      });
    await mediator.send<Lauréat.Fournisseur.ModifierÉvaluationCarboneUseCase>({
      type: 'Lauréat.Fournisseur.UseCase.ModifierÉvaluationCarbone',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        modifiéeLeValue: modifiéeLe,
        modifiéeParValue: modifiéePar,
        évaluationCarboneSimplifiéeValue: évaluationCarbone,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
