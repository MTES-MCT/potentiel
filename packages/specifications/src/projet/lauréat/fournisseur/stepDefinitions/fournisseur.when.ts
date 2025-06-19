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

Quand('le porteur enregistre un changement de fournisseur', async function (this: PotentielWorld) {
  await enregistrerChangementFournisseur.call(this);
});

Quand(
  'le porteur enregistre un changement de fournisseur avec :',
  async function (this: PotentielWorld, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await enregistrerChangementFournisseur.call(
      this,
      this.lauréatWorld.fournisseurWorld.mapExempleToFixtureValues(exemple),
    );
  },
);

Quand(
  'le porteur enregistre un changement de fournisseur sans modification',
  async function (this: PotentielWorld) {
    const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
      type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
      data: {
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });
    assert(Option.isSome(fournisseur), 'Fournisseur non trouvé');

    await enregistrerChangementFournisseur.call(this, {
      évaluationCarbone: fournisseur.évaluationCarboneSimplifiée,
      fournisseurs: fournisseur.fournisseurs
        .map(Lauréat.Fournisseur.Fournisseur.bind)
        .map((fournisseur) => fournisseur.formatter()),
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

export async function enregistrerChangementFournisseur(
  this: PotentielWorld,
  values: {
    évaluationCarbone?: number;
    fournisseurs?: Array<Lauréat.Fournisseur.Fournisseur.RawType>;
  } = {},
) {
  try {
    const {
      évaluationCarbone,
      fournisseurs,
      enregistréLe,
      enregistréPar,
      pièceJustificative,
      raison,
    } = this.lauréatWorld.fournisseurWorld.enregistrerChangementFournisseur.créer({
      enregistréPar: this.utilisateurWorld.adminFixture.email,
      ...values,
    });

    await mediator.send<Lauréat.Fournisseur.EnregistrerChangementFournisseurUseCase>({
      type: 'Lauréat.Fournisseur.UseCase.EnregistrerChangement',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        évaluationCarboneSimplifiéeValue: évaluationCarbone,
        fournisseursValue: fournisseurs,
        dateChangementValue: enregistréLe,
        identifiantUtilisateurValue: enregistréPar,
        raisonValue: raison,
        pièceJustificativeValue: pièceJustificative,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
