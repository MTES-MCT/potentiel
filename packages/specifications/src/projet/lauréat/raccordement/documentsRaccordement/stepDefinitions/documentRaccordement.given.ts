import { type DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import type { PotentielWorld } from '../../../../../potentiel.world.js';
import { transmettreDocumentRaccordement } from './documentRaccordement.when.js';

EtantDonné(
  'un document raccordement transmis pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet, référenceDossier } =
      this.lauréatWorld.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;

    await transmettreDocumentRaccordement.call(this, identifiantProjet, référenceDossier);
  },
);

EtantDonné(
  'un document raccordement transmis pour le projet lauréat avec :',
  async function (this: PotentielWorld, data: DataTable) {
    const { identifiantProjet, référenceDossier } =
      this.lauréatWorld.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;

    await transmettreDocumentRaccordement.call(
      this,
      identifiantProjet,
      référenceDossier,
      this.lauréatWorld.raccordementWorld.documentRaccordement.mapExempleToFixtureValues(
        data.rowsHash(),
      ),
    );
  },
);
