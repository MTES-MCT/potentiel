import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../potentiel.world.js';

import { transmettreDateMiseEnService } from './dateMiseEnService.when.js';

EtantDonné(
  /une date de mise en service pour le dossier de raccordement du projet lauréat$/,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateMiseEnService, référenceDossier } =
      this.raccordementWorld.dateMiseEnService.transmettreFixture.créer({
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossier: this.raccordementWorld.référenceDossier,
      });

    await transmettreDateMiseEnService({
      potentielWorld: this,
      identifiantProjet: identifiantProjet.formatter(),
      dateMiseEnService,
      référenceDossier,
      transmiseParValue: this.utilisateurWorld.adminFixture.email,
    });
  },
);

EtantDonné(
  /une date de mise en service pour le dossier de raccordement du projet lauréat avec :$/,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    const { dateMiseEnService } =
      this.raccordementWorld.dateMiseEnService.transmettreFixture.mapExempleToFixtureValues(
        datatable.rowsHash(),
      );

    if (!dateMiseEnService) {
      throw new Error(`La table d'exemple doit contenir le champ "La date de mise en service"`);
    }

    await transmettreDateMiseEnService({
      potentielWorld: this,
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService,
      transmiseParValue: this.utilisateurWorld.adminFixture.email,
    });
  },
);
