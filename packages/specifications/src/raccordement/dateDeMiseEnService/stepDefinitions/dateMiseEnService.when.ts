import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world.js';

Quand(
  /(le gestionnaire de réseau|l'administrateur) transmet la date de mise en service pour le dossier de raccordement du projet lauréat$/,
  async function (this: PotentielWorld, rôle: 'le gestionnaire de réseau' | "l'administrateur") {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateMiseEnService, référenceDossier } =
      this.raccordementWorld.transmettreDateMiseEnServiceFixture.créer({
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossier: this.raccordementWorld.référenceDossier,
      });

    await transmettreDateMiseEnService({
      potentielWorld: this,
      identifiantProjet,
      référenceDossier,
      dateMiseEnService,
      rôle: rôle === 'le gestionnaire de réseau' ? 'grd' : 'admin',
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
      this.raccordementWorld.transmettreDateMiseEnServiceFixture.créer({
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossier: this.raccordementWorld.référenceDossier,
        ...this.raccordementWorld.transmettreDateMiseEnServiceFixture.mapExempleToFixtureValues(
          datatable.rowsHash(),
        ),
      });

    await transmettreDateMiseEnService({
      potentielWorld: this,
      identifiantProjet,
      référenceDossier,
      dateMiseEnService,
      rôle: rôle === 'le gestionnaire de réseau' ? 'grd' : 'admin',
    });
  },
);

Quand(
  `le gestionnaire de réseau supprime la mise en service du dossier de raccordement`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await supprimerDateMiseEnService.call(this, identifiantProjet, référenceDossier);
  },
);

type TransmettreDateMiseEnServiceProps = {
  potentielWorld: PotentielWorld;
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossier: string;
  rôle: 'admin' | 'grd';
  dateMiseEnService: string;
};

export async function transmettreDateMiseEnService({
  potentielWorld,
  identifiantProjet,
  référenceDossier,
  dateMiseEnService,
  rôle,
}: TransmettreDateMiseEnServiceProps) {
  // const { dateMiseEnService, référenceDossier } =
  //   potentielWorld.raccordementWorld.transmettreDateMiseEnServiceFixture.créer({
  //     identifiantProjet: identifiantProjet.formatter(),
  //     référenceDossier: référence,
  //     ...potentielWorld.raccordementWorld.transmettreDateMiseEnServiceFixture.mapExempleToFixtureValues(
  //       data,
  //     ),
  //   });
  try {
    await mediator.send<Lauréat.Raccordement.TransmettreDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        référenceDossierValue: référenceDossier,
        dateMiseEnServiceValue: dateMiseEnService,
        transmiseLeValue: DateTime.now().formatter(),
        transmiseParValue:
          rôle === 'grd'
            ? potentielWorld.utilisateurWorld.grdFixture.email
            : potentielWorld.utilisateurWorld.adminFixture.email,
      },
    });
  } catch (e) {
    potentielWorld.error = e as Error;
  }
}

async function supprimerDateMiseEnService(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  référence: string,
) {
  try {
    await mediator.send<Lauréat.Raccordement.SupprimerDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.SupprimerDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        référenceDossierValue: référence,
        suppriméeLeValue: DateTime.now().formatter(),
        suppriméeParValue: this.utilisateurWorld.grdFixture.email,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
