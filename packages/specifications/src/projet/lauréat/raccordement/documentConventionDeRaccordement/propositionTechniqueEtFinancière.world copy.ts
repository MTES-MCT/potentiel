import { mapDateTime, mapToExemple } from '#helpers';
import {
  type ModifierDocumentRaccordement,
  ModifierDocumentRaccordementFixture,
} from './fixtures/modifierDocumentRaccordement.fixture.js';
import {
  type TransmettreDocumentRaccordement,
  TransmettreDocumentRaccordementFixture,
} from './fixtures/transmettreDocumentRaccordement.fixture.js';

export class DocumentRaccordementWorld {
  readonly transmettreFixture = new TransmettreDocumentRaccordementFixture();
  readonly modifierFixture = new ModifierDocumentRaccordementFixture();

  mapToExpected(nouvelleRéférenceDossier: string | undefined) {
    return (
      this.modifierFixture.mapToExpected(nouvelleRéférenceDossier) ??
      this.transmettreFixture.mapToExpected(nouvelleRéférenceDossier)
    );
  }
  mapExempleToFixtureValues(exemple: Record<string, string>) {
    return mapToExemple<TransmettreDocumentRaccordement & ModifierDocumentRaccordement>(exemple, {
      dateSignature: ['La date de signature', mapDateTime],
      référenceDossier: ['La référence du dossier de raccordement'],
    });
  }
}
