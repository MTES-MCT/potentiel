import { type DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import type { PotentielWorld } from '../../../../../potentiel.world.js';
import { transmettreDateMiseEnService } from './dateMiseEnService.when.js';

EtantDonné(
  /une date de mise en service pour le dossier de raccordement du projet lauréat$/,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateMiseEnService, référenceDossier } =
      this.lauréatWorld.raccordementWorld.dateMiseEnService.transmettreFixture.créer({
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossier: this.lauréatWorld.raccordementWorld.référenceDossier,
      });

    await transmettreDateMiseEnService.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService,
      this.utilisateurWorld.dgecFixture.email,
    );
  },
);

EtantDonné(
  /une date de mise en service pour le dossier de raccordement du projet lauréat avec :$/,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.lauréatWorld.raccordementWorld;

    const { dateMiseEnService } =
      this.lauréatWorld.raccordementWorld.dateMiseEnService.transmettreFixture.mapExempleToFixtureValues(
        datatable.rowsHash(),
      );

    if (!dateMiseEnService) {
      throw new Error(`La table d'exemple doit contenir le champ "La date de mise en service"`);
    }

    await transmettreDateMiseEnService.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService,
      this.utilisateurWorld.dgecFixture.email,
    );
  },
);
