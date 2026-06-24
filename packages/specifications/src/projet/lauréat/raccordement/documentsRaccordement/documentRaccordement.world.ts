import { Lauréat } from '@potentiel-domain/projet';

import { mapDateTime, mapToExemple, mapValueType } from '#helpers';
import {
  type TransmettreDocumentRaccordement,
  TransmettreDocumentRaccordementFixture,
} from './fixtures/transmettreDocumentRaccordement.fixture.js';

export class DocumentRaccordementWorld {
  readonly transmettreFixture = new TransmettreDocumentRaccordementFixture();

  mapToExpected(nouvelleRéférenceDossier: string | undefined) {
    return this.transmettreFixture.mapToExpected(nouvelleRéférenceDossier);
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    return mapToExemple<TransmettreDocumentRaccordement>(exemple, {
      dateSignature: ['La date de signature', mapDateTime],
      référenceDossier: ['La référence du dossier de raccordement'],
      type: [
        'type de document',
        mapValueType(Lauréat.Raccordement.TypeDocumentsRaccordement.convertirEnValueType),
      ],
    });
  }
}
