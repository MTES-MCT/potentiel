import { mapBoolean, mapDateTime, mapToExemple } from '#helpers';

import { ImporterDemandeComplèteRaccordementFixture } from './fixtures/importerDemandeComplèteDeRaccordement.fixture.js';
import {
  ModifierDemandeComplèteRaccordement,
  ModifierDemandeComplèteRaccordementFixture,
} from './fixtures/modifierDemandeComplèteDeRaccordement.fixture.js';
import {
  TransmettreDemandeComplèteRaccordement,
  TransmettreDemandeComplèteRaccordementFixture,
} from './fixtures/transmettreDemandeComplèteDeRaccordement.fixture.js';

export class DemandeComplèteRaccordementWorld {
  readonly transmettreFixture = new TransmettreDemandeComplèteRaccordementFixture();
  readonly modifierFixture = new ModifierDemandeComplèteRaccordementFixture();
  readonly importerFixture = new ImporterDemandeComplèteRaccordementFixture();

  mapToExpected(nouvelleRéférenceDossier: string | undefined) {
    return (
      this.modifierFixture.mapToExpected(nouvelleRéférenceDossier) ??
      this.transmettreFixture.mapToExpected(nouvelleRéférenceDossier) ??
      this.importerFixture.mapToExpected(nouvelleRéférenceDossier)
    );
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    return mapToExemple<
      TransmettreDemandeComplèteRaccordement & ModifierDemandeComplèteRaccordement
    >(exemple, {
      dateQualification: ['La date de qualification', mapDateTime],
      référenceDossier: ['La référence du dossier de raccordement'],
      estUnNouveauDocument: ['Le document a été modifié ?', mapBoolean],
    });
  }
}
