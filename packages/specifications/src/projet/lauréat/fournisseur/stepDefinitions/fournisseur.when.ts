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
  await mettreÀJourFournisseur.call(this, 'information-enregistrée');
});

Quand(
  'le porteur enregistre un changement de fournisseur avec :',
  async function (this: PotentielWorld, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await mettreÀJourFournisseur.call(
      this,
      'information-enregistrée',
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

    await mettreÀJourFournisseur.call(this, 'information-enregistrée', {
      évaluationCarbone: fournisseur.évaluationCarboneSimplifiée,
      fournisseurs: fournisseur.fournisseurs
        .map(Lauréat.Fournisseur.Fournisseur.bind)
        .map((fournisseur) => fournisseur.formatter()),
    });
  },
);

Quand(
  'le DGEC validateur modifie le fournisseur du projet lauréat',
  async function (this: PotentielWorld) {
    await mettreÀJourFournisseur.call(this, 'modification-admin');
  },
);

Quand(
  'le DGEC validateur modifie le fournisseur du projet lauréat avec :',
  async function (this: PotentielWorld, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await mettreÀJourFournisseur.call(
      this,
      'modification-admin',
      this.lauréatWorld.fournisseurWorld.mapExempleToFixtureValues(exemple),
    );
  },
);

Quand(
  'le DGEC validateur modifie le fournisseur du projet lauréat avec des valeurs identiques',
  async function (this: PotentielWorld) {
    const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
      type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
      data: {
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });
    assert(Option.isSome(fournisseur), 'Fournisseur non trouvé');

    await mettreÀJourFournisseur.call(this, 'modification-admin', {
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

export async function mettreÀJourFournisseur(
  this: PotentielWorld,
  typeDeChangement: 'modification-admin' | 'information-enregistrée',
  values: {
    évaluationCarbone?: number;
    fournisseurs?: Array<Lauréat.Fournisseur.Fournisseur.RawType>;
  } = {},
) {
  const utilisateurFixture =
    typeDeChangement === 'information-enregistrée'
      ? this.utilisateurWorld.porteurFixture
      : this.utilisateurWorld.validateurFixture;

  try {
    const { évaluationCarbone, fournisseurs, misAJourLe, misAJourPar, pièceJustificative, raison } =
      this.lauréatWorld.fournisseurWorld.mettreÀJourFournisseur.créer({
        misAJourPar: utilisateurFixture.email,
        ...values,
      });

    await mediator.send<Lauréat.Fournisseur.MettreÀJourFournisseurUseCase>({
      type: 'Lauréat.Fournisseur.UseCase.MettreAJour',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        évaluationCarboneSimplifiéeValue: évaluationCarbone,
        fournisseursValue: fournisseurs,
        dateValue: misAJourLe,
        identifiantUtilisateurValue: misAJourPar,
        raisonValue: raison,
        pièceJustificativeValue: pièceJustificative,
        rôleUtilisateurValue: utilisateurFixture.role,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
