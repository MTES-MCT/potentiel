import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';

import { sleep } from '#helpers';

import { PotentielWorld } from '../../../potentiel.world.js';

Quand(
  /(le gestionnaire de réseau|l'administrateur) transmet la date de mise en service pour le dossier de raccordement du projet lauréat$/,
  async function (this: PotentielWorld, rôle: 'le gestionnaire de réseau' | "l'administrateur") {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateMiseEnService, référenceDossier } =
      this.raccordementWorld.dateMiseEnService.transmettreFixture.créer({
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossier: this.raccordementWorld.référenceDossier,
      });

    await transmettreDateMiseEnService({
      potentielWorld: this,
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService,
      transmiseParValue:
        rôle === 'le gestionnaire de réseau'
          ? this.utilisateurWorld.grdFixture.email
          : this.utilisateurWorld.adminFixture.email,
    });
  },
);

Quand(
  /(le gestionnaire de réseau|l'administrateur) transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :$/,
  async function (
    this: PotentielWorld,
    rôle: 'le gestionnaire de réseau' | "l'administrateur",
    datatable: DataTable,
  ) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateMiseEnService, référenceDossier } =
      this.raccordementWorld.dateMiseEnService.transmettreFixture.créer({
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossier: this.raccordementWorld.référenceDossier,
        ...this.raccordementWorld.dateMiseEnService.transmettreFixture.mapExempleToFixtureValues(
          datatable.rowsHash(),
        ),
      });

    await sleep(500);

    await transmettreDateMiseEnService({
      potentielWorld: this,
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService,
      transmiseParValue:
        rôle === 'le gestionnaire de réseau'
          ? this.utilisateurWorld.grdFixture.email
          : this.utilisateurWorld.adminFixture.email,
    });
  },
);

Quand(
  /l'administrateur transmet la date de mise en service pour le dossier de raccordement du projet lauréat$/,
  async function (this: PotentielWorld, rôle: 'le gestionnaire de réseau' | "l'administrateur") {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateMiseEnService, référenceDossier } =
      this.raccordementWorld.dateMiseEnService.transmettreFixture.créer({
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossier: this.raccordementWorld.référenceDossier,
      });

    await transmettreDateMiseEnService({
      potentielWorld: this,
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService,
      transmiseParValue:
        rôle === 'le gestionnaire de réseau'
          ? this.utilisateurWorld.grdFixture.email
          : this.utilisateurWorld.adminFixture.email,
    });
  },
);

Quand(
  /l'administrateur modifie la date de mise en service pour le dossier de raccordement du projet lauréat$/,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateMiseEnService, référenceDossier } =
      this.raccordementWorld.dateMiseEnService.modifierFixture.créer({
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossier: this.raccordementWorld.référenceDossier,
      });

    await modifierDateMiseEnService({
      potentielWorld: this,
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService,
      modifiéeParValue: this.utilisateurWorld.adminFixture.email,
    });
  },
);

Quand(
  /l'administrateur supprime la mise en service du dossier de raccordement$/,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await supprimerDateMiseEnService({
      potentielWorld: this,
      identifiantProjet,
      référence: référenceDossier,
    });
  },
);

Quand(
  /l'administrateur supprime la mise en service du dossier de raccordement avec :$/,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;

    const { référenceDossier } =
      this.raccordementWorld.dateMiseEnService.transmettreFixture.mapExempleToFixtureValues(
        datatable.rowsHash(),
      );

    if (!référenceDossier) {
      throw new Error(
        `"La référence du dossier de raccordement" est requis dans le tableau d'exemple pour supprimer la mise en service`,
      );
    }

    await supprimerDateMiseEnService({
      potentielWorld: this,
      identifiantProjet,
      référence: référenceDossier,
    });
  },
);

type TransmettreDateMiseEnServiceProps = {
  potentielWorld: PotentielWorld;
  identifiantProjet: IdentifiantProjet.RawType;
  référenceDossier: Lauréat.Raccordement.RéférenceDossierRaccordement.RawType;
  transmiseParValue: string;
  dateMiseEnService: string;
};

export async function transmettreDateMiseEnService({
  potentielWorld,
  identifiantProjet,
  référenceDossier,
  dateMiseEnService,
  transmiseParValue,
}: TransmettreDateMiseEnServiceProps) {
  try {
    await mediator.send<Lauréat.Raccordement.TransmettreDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierValue: référenceDossier,
        dateMiseEnServiceValue: dateMiseEnService,
        transmiseLeValue: DateTime.now().formatter(),
        transmiseParValue,
      },
    });
  } catch (e) {
    potentielWorld.error = e as Error;
  }
}

type ModifierDateMiseEnServiceProps = {
  potentielWorld: PotentielWorld;
  identifiantProjet: IdentifiantProjet.RawType;
  référenceDossier: Lauréat.Raccordement.RéférenceDossierRaccordement.RawType;
  dateMiseEnService: string;
  modifiéeParValue: string;
};

export async function modifierDateMiseEnService({
  potentielWorld,
  identifiantProjet,
  référenceDossier,
  dateMiseEnService,
}: ModifierDateMiseEnServiceProps) {
  try {
    await mediator.send<Lauréat.Raccordement.ModifierDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierValue: référenceDossier,
        dateMiseEnServiceValue: dateMiseEnService,
        modifiéeLeValue: DateTime.now().formatter(),
        modifiéeParValue: potentielWorld.utilisateurWorld.adminFixture.email,
      },
    });
  } catch (e) {
    potentielWorld.error = e as Error;
  }
}

type SupprimerDateMiseEnServiceProps = {
  potentielWorld: PotentielWorld;
  identifiantProjet: IdentifiantProjet.ValueType;
  référence: string;
};

async function supprimerDateMiseEnService({
  potentielWorld,
  identifiantProjet,
  référence,
}: SupprimerDateMiseEnServiceProps) {
  try {
    await mediator.send<Lauréat.Raccordement.SupprimerDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.SupprimerDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        référenceDossierValue: référence,
        suppriméeLeValue: DateTime.now().formatter(),
        suppriméeParValue: potentielWorld.utilisateurWorld.adminFixture.email,
      },
    });
  } catch (e) {
    potentielWorld.error = e as Error;
  }
}
