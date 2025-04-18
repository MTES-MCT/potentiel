import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/laureat';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

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
  `le Gestionnaire de réseau supprime la mise en service du dossier de raccordement`,
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
    await mediator.send<Raccordement.RaccordementUseCase>({
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
    await mediator.send<Raccordement.RaccordementUseCase>({
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
