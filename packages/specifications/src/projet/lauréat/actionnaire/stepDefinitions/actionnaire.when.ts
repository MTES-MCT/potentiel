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

Quand(
  "le porteur demande la modification de l'actionnaire pour le projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      await demanderModificationActionnaire.call(
        this,
        statutProjet,
        this.utilisateurWorld.porteurFixture.email,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function demanderModificationActionnaire(
  this: PotentielWorld,
  statutProjet: 'lauréat' | 'éliminé',
  utilisateur?: string,
) {
  const identifiantProjet =
    statutProjet === 'lauréat'
      ? this.lauréatWorld.identifiantProjet.formatter()
      : this.eliminéWorld.identifiantProjet.formatter();
  const {
    pièceJustificative: { format, content },
    demandéLe,
    demandéPar,
    raison,
    actionnaire,
  } = this.lauréatWorld.actionnaireWorld.demanderModificationActionnaireFixture.créer({
    demandéPar: utilisateur,
  });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.DemanderModification',
    data: {
      raisonValue: raison,
      actionnaireValue: actionnaire,
      dateDemandeValue: demandéLe,
      identifiantUtilisateurValue: demandéPar,
      identifiantProjetValue: identifiantProjet,
      pièceJustificativeValue: {
        content,
        format,
      },
    },
  });
}

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
