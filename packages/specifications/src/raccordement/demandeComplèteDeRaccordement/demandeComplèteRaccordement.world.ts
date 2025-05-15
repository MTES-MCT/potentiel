import { ModifierDemandeComplèteRaccordementFixture } from './fixtures/modifierDemandeComplèteDeRaccordement.fixture';
import { TransmettreDemandeComplèteRaccordementFixture } from './fixtures/transmettreDemandeComplèteDeRaccordement.fixture';

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
