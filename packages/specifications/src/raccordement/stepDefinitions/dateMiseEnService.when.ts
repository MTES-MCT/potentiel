import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/reseau';
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
      type: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
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
