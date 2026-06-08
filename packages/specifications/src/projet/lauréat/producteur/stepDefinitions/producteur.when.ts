import { type DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { convertFixtureFileToReadableStream } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';

Quand(
  'le porteur enregistre un changement de producteur pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await enregistrerChangementProducteur.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur enregistre un changement de producteur avec une valeur identique pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await enregistrerChangementProducteur.call(this, {
        producteur: this.candidatureWorld.importerCandidature.dépôtValue.nomCandidat,
        siret: this.candidatureWorld.importerCandidature.dépôtValue.numéroIdentification?.siret,
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur corrige le numéro d'identification du projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await corrigerNuméroIdentification.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur corrige le numéro d'identification du projet lauréat avec une valeur identique",
  async function (this: PotentielWorld) {
    try {
      await corrigerNuméroIdentification.call(this, {
        siret: this.candidatureWorld.importerCandidature.dépôtValue.numéroIdentification?.siret,
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'la DGEC modifie le producteur du projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      const { identifiantProjet } =
        statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

      await modifierProducteur.call(this, identifiantProjet);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'la DGEC modifie le producteur avec :',
  async function (this: PotentielWorld, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    try {
      const { identifiantProjet } = this.lauréatWorld;

      await modifierProducteur.call(this, identifiantProjet, {
        producteur: this.candidatureWorld.importerCandidature.dépôtValue.nomCandidat,
        siret: this.candidatureWorld.importerCandidature.dépôtValue.numéroIdentification?.siret,
        ...this.lauréatWorld.producteurWorld.mapExempleToFixtureValues(exemple),
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'la DGEC modifie le producteur avec des valeurs identiques pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await modifierProducteur.call(this, this.lauréatWorld.identifiantProjet, {
        producteur: this.candidatureWorld.importerCandidature.dépôtValue.nomCandidat,
        siret: this.candidatureWorld.importerCandidature.dépôtValue.numéroIdentification?.siret,
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

type ModifierProducteurProps = { producteur: string; siret: string };

async function enregistrerChangementProducteur(
  this: PotentielWorld,
  data?: Partial<ModifierProducteurProps>,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet;

  const { pièceJustificative, enregistréLe, enregistréPar, producteur, siret } =
    this.lauréatWorld.producteurWorld.enregistrerChangementProducteurFixture.créer({
      enregistréPar: this.utilisateurWorld.porteurFixture.email,
      ...data,
    });

  await mediator.send<Lauréat.Producteur.EnregistrerChangementProducteurUseCase>({
    type: 'Lauréat.Producteur.UseCase.EnregistrerChangement',
    data: {
      producteurValue: producteur,
      dateChangementValue: enregistréLe,
      identifiantUtilisateurValue: enregistréPar,
      identifiantProjetValue: identifiantProjet.formatter(),
      pièceJustificativeValue: convertFixtureFileToReadableStream(pièceJustificative),
      numéroIdentificationValue: { siret },
    },
  });
}

async function corrigerNuméroIdentification(
  this: PotentielWorld,
  data?: Partial<ModifierProducteurProps>,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet;

  const { pièceJustificative, corrigéLe, corrigéPar, siret } =
    this.lauréatWorld.producteurWorld.corrigerNuméroIdentificationFixture.créer({
      corrigéPar: this.utilisateurWorld.porteurFixture.email,
      ...data,
    });

  await mediator.send<Lauréat.Producteur.CorrigerNuméroIdentificationUseCase>({
    type: 'Lauréat.Producteur.UseCase.CorrigerNuméroIdentification',
    data: {
      dateChangementValue: corrigéLe,
      identifiantUtilisateurValue: corrigéPar,
      identifiantProjetValue: identifiantProjet.formatter(),
      pièceJustificativeValue: convertFixtureFileToReadableStream(pièceJustificative),
      numéroIdentificationValue: { siret },
    },
  });
}

async function modifierProducteur(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  data?: Partial<ModifierProducteurProps>,
) {
  const { modifiéLe, modifiéPar, producteur, raison, siret } =
    this.lauréatWorld.producteurWorld.modifierProducteurFixture.créer({
      modifiéPar: this.utilisateurWorld.dgecFixture.email,
      ...data,
    });

  await mediator.send<Lauréat.Producteur.ModifierProducteurUseCase>({
    type: 'Lauréat.Producteur.UseCase.ModifierProducteur',
    data: {
      producteurValue: producteur,
      dateModificationValue: modifiéLe,
      identifiantUtilisateurValue: modifiéPar,
      identifiantProjetValue: identifiantProjet.formatter(),
      raisonValue: raison,
      numéroIdentificationValue: { siret },
    },
  });
}
