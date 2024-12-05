import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Actionnaire } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../potentiel.world';

import { importerActionnaire } from './actionnaire.given';

Quand("l'actionnaire est importé pour le projet", async function (this: PotentielWorld) {
  try {
    await importerActionnaire.call(this);
  } catch (error) {
    this.error = error as Error;
  }
});

Quand(
  "le DGEC validateur modifie l'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierActionnaire.call(this, this.utilisateurWorld.adminFixture.email);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "la DREAL modifie l'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur modifie l'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierActionnaire.call(this, this.utilisateurWorld.porteurFixture.email);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le DGEC validateur modifie l'actionnaire avec la même valeur pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierActionnaireSansChangement.call(
        this,
        this.utilisateurWorld.porteurFixture.email,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function modifierActionnaire(this: PotentielWorld, modifiéPar: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { actionnaire, dateModification } =
    this.lauréatWorld.actionnaireWorld.modifierActionnaireFixture.créer();

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: modifiéPar,
      actionnaireValue: actionnaire,
      dateModificationValue: dateModification,
    },
  });
}

async function modifierActionnaireSansChangement(this: PotentielWorld, modifiéPar: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: modifiéPar,
      actionnaireValue: this.lauréatWorld.actionnaireWorld.importerActionnaireFixture.actionnaire,
      dateModificationValue: DateTime.now().formatter(),
    },
  });
}
