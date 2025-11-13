import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world';

Quand(
  `le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :`,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await transmettreDateMiseEnService.call(
      this,
      identifiantProjet,
      référenceDossier,
      datatable.rowsHash(),
    );
  },
);

Quand(
  `le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await transmettreDateMiseEnService.call(this, identifiantProjet, référenceDossier);
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

async function transmettreDateMiseEnService(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  référence: string,
  data: Record<string, string> = {},
) {
  const { dateMiseEnService, référenceDossier } =
    this.raccordementWorld.transmettreDateMiseEnServiceFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier: référence,
      ...this.raccordementWorld.transmettreDateMiseEnServiceFixture.mapExempleToFixtureValues(data),
    });
  try {
    await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        référenceDossierValue: référenceDossier,
        dateMiseEnServiceValue: dateMiseEnService,
        transmiseLeValue: DateTime.now().formatter(),
        transmiseParValue: this.utilisateurWorld.grdFixture.email,
      },
    });
  } catch (e) {
    this.error = e as Error;
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
