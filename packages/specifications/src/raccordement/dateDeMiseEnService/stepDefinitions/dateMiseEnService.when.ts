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

    await transmettreDateMiseEnService.call(
      this,
      identifiantProjet.formatter(),
      Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
        référenceDossier,
      ).formatter(),
      DateTime.convertirEnValueType(dateMiseEnService).formatter(),
      rôle === 'le gestionnaire de réseau'
        ? this.utilisateurWorld.grdFixture.email
        : this.utilisateurWorld.adminFixture.email,
    );
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

    await transmettreDateMiseEnService.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService,
      rôle === 'le gestionnaire de réseau'
        ? this.utilisateurWorld.grdFixture.email
        : this.utilisateurWorld.adminFixture.email,
    );
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

    await modifierDateMiseEnService.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService,
    );
  },
);

Quand(
  /l'administrateur modifie la date de mise en service pour le dossier de raccordement du projet lauréat avec :$/,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateMiseEnService, référenceDossier } =
      this.raccordementWorld.dateMiseEnService.modifierFixture.créer({
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossier: this.raccordementWorld.référenceDossier,
        ...this.raccordementWorld.dateMiseEnService.modifierFixture.mapExempleToFixtureValues(
          datatable.rowsHash(),
        ),
      });

    await modifierDateMiseEnService.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService,
    );
  },
);

Quand(
  /l'administrateur supprime la mise en service du dossier de raccordement$/,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await supprimerDateMiseEnService.call(this, identifiantProjet.formatter(), référenceDossier);
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

    await supprimerDateMiseEnService.call(this, identifiantProjet.formatter(), référenceDossier);
  },
);

export async function transmettreDateMiseEnService(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.RawType,
  référenceDossier: string,
  dateMiseEnService: string,
  transmiseParValue: string,
) {
  try {
    await mediator.send<Lauréat.Raccordement.TransmettreDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierValue:
          Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
            référenceDossier,
          ).formatter(),
        dateMiseEnServiceValue: DateTime.convertirEnValueType(dateMiseEnService).formatter(),
        transmiseLeValue: DateTime.now().formatter(),
        transmiseParValue,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}

export async function modifierDateMiseEnService(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.RawType,
  référenceDossier: string,
  dateMiseEnService: string,
) {
  try {
    await mediator.send<Lauréat.Raccordement.ModifierDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierValue:
          Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
            référenceDossier,
          ).formatter(),
        dateMiseEnServiceValue: DateTime.convertirEnValueType(dateMiseEnService).formatter(),
        modifiéeLeValue: DateTime.now().formatter(),
        modifiéeParValue: this.utilisateurWorld.adminFixture.email,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}

async function supprimerDateMiseEnService(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.RawType,
  référenceDossier: string,
) {
  try {
    await mediator.send<Lauréat.Raccordement.SupprimerDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.SupprimerDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierValue:
          Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
            référenceDossier,
          ).formatter(),
        suppriméeLeValue: DateTime.now().formatter(),
        suppriméeParValue: this.utilisateurWorld.adminFixture.email,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
