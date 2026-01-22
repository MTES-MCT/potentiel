import { ModifierDemandeComplèteRaccordementFixture } from './fixtures/modifierDemandeComplèteDeRaccordement.fixture.js';
import { TransmettreDemandeComplèteRaccordementFixture } from './fixtures/transmettreDemandeComplèteDeRaccordement.fixture.js';

export class DemandeComplèteRaccordementWorld {
  readonly transmettreFixture = new TransmettreDemandeComplèteRaccordementFixture();
  readonly modifierFixture = new ModifierDemandeComplèteRaccordementFixture();

  mapToExpected(nouvelleRéférenceDossier: string | undefined) {
    return (
      this.modifierFixture.mapToExpected(nouvelleRéférenceDossier) ??
      this.transmettreFixture.mapToExpected(nouvelleRéférenceDossier)
    );
  }
}
