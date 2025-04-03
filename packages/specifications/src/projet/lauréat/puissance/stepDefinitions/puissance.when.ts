import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';

Quand('la puissance est importée pour le projet', async function (this: PotentielWorld) {
  try {
    await importerPuissance.call(this);
  } catch (error) {
    this.error = error as Error;
  }
});

Quand(
  `le DGEC validateur modifie la puissance pour le projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      await modifierPuissance.call(
        this,
        this.utilisateurWorld.validateurFixture.email,
        statutProjet,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le DGEC validateur modifie la puissance avec la même valeur pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await modifierPuissance.call(this, this.utilisateurWorld.adminFixture.email, 'lauréat', 1);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le DGEC validateur modifie la puissance pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await modifierPuissance.call(
        this,
        this.utilisateurWorld.adminFixture.email,
        'lauréat',
        Number(exemple['ratio puissance']),
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur demande le changement de puissance avec la même valeur pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await demanderChangementPuissance.call(this, 'lauréat', 1);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur demande le changement de puissance à la baisse pour le projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      await demanderChangementPuissance.call(this, statutProjet, undefined);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur demande le changement de puissance à la hausse pour le projet lauréat',
  async function (this: PotentielWorld) {
    const ratioALaHausse = 1.5;
    try {
      await demanderChangementPuissance.call(this, 'lauréat', ratioALaHausse);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur demande le changement de puissance pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await demanderChangementPuissance.call(this, 'lauréat', Number(exemple['ratio puissance']));
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur annule la demande de changement de puissance pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await annulerChangementPuissance.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function importerPuissance(this: PotentielWorld) {
  const identifiantProjet = this.candidatureWorld.importerCandidature.identifiantProjet;
  const { importéeLe } = this.lauréatWorld.puissanceWorld.importerPuissanceFixture.créer({
    puissance: this.candidatureWorld.importerCandidature.values.puissanceProductionAnnuelleValue,
  });

  await mediator.send<Puissance.PuissanceCommand>({
    type: 'Lauréat.Puissance.Command.ImporterPuissance',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéeLe: DateTime.convertirEnValueType(importéeLe),
    },
  });
}

async function modifierPuissance(
  this: PotentielWorld,
  modifiéPar: string,
  statutProjet?: 'lauréat' | 'éliminé',
  ratio?: number,
) {
  const identifiantProjet =
    statutProjet === 'éliminé'
      ? this.eliminéWorld.identifiantProjet.formatter()
      : this.lauréatWorld.identifiantProjet.formatter();

  const { puissance, dateModification, raison } =
    this.lauréatWorld.puissanceWorld.modifierPuissanceFixture.créer(
      ratio !== undefined
        ? {
            puissance: this.lauréatWorld.puissanceWorld.importerPuissanceFixture.puissance * ratio,
          }
        : undefined,
    );

  await mediator.send<Puissance.PuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.ModifierPuissance',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: modifiéPar,
      puissanceValue: puissance,
      dateModificationValue: dateModification,
      raisonValue: raison,
    },
  });
}

export async function demanderChangementPuissance(
  this: PotentielWorld,
  statutProjet: 'lauréat' | 'éliminé',
  ratioValue?: number,
) {
  const identifiantProjet =
    statutProjet === 'lauréat'
      ? this.lauréatWorld.identifiantProjet
      : this.eliminéWorld.identifiantProjet;

  const { pièceJustificative, demandéLe, demandéPar, raison, ratio } =
    this.lauréatWorld.puissanceWorld.demanderChangementPuissanceFixture.créer({
      demandéPar: this.utilisateurWorld.porteurFixture.email,
      ...(ratioValue !== undefined && { ratio: ratioValue }),
    });

  const puissanceValue =
    ratio * this.lauréatWorld.puissanceWorld.mapToExpected(identifiantProjet).puissance;

  await mediator.send<Puissance.PuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.DemanderChangement',
    data: {
      raisonValue: raison,
      puissanceValue,
      dateDemandeValue: demandéLe,
      identifiantUtilisateurValue: demandéPar,
      identifiantProjetValue: identifiantProjet.formatter(),
      pièceJustificativeValue: pièceJustificative,
    },
  });
}

export async function annulerChangementPuissance(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { annuléeLe, annuléePar } =
    this.lauréatWorld.puissanceWorld.annulerChangementPuissanceFixture.créer({
      annuléePar: this.utilisateurWorld.porteurFixture.email,
    });

  await mediator.send<Puissance.PuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.AnnulerDemandeChangement',
    data: {
      dateAnnulationValue: annuléeLe,
      identifiantUtilisateurValue: annuléePar,
      identifiantProjetValue: identifiantProjet,
    },
  });
}
