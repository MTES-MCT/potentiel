import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { mapDateTime, mapToExemple, mapValueType } from '#helpers';
import {
  type ModifierDocument,
  ModifierDocumentFixture,
} from './fixtures/modifierDocumentRaccordement.fixture.js';
import {
  type SupprimerDocument,
  SupprimerDocumentFixture,
} from './fixtures/supprimerDocumentRaccordement.fixture.js';
import {
  type TransmettreDocument,
  TransmettreDocumentFixture,
} from './fixtures/transmettreDocumentRaccordement.fixture.js';

export class DocumentRaccordementWorld {
  // Stocker les documents par type
  #documentsRaccordement = new Map<string, TransmettreDocument | ModifierDocument>();

  ajouterDocument(document: TransmettreDocument | ModifierDocument) {
    this.#documentsRaccordement.set(document.type, document);
  }

  supprimerDocument(document: SupprimerDocument) {
    this.#documentsRaccordement.delete(document.type);
  }

  getDocumentRaccordement(type: string) {
    return this.#documentsRaccordement.get(type);
  }

  readonly transmettreFixture = new TransmettreDocumentFixture(this);
  readonly modifierFixture = new ModifierDocumentFixture(this);
  readonly supprimerFixture = new SupprimerDocumentFixture(this);

  mapToExpected(
    type: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType,
    identifiantProjet: string,
    référenceDossier?: string,
  ) {
    const document = this.getDocumentRaccordement(type);

    if (!document) return;

    return {
      dateSignature: DateTime.convertirEnValueType(document.dateSignature),
      document: Lauréat.Raccordement.DocumentRaccordement.documentRaccordement(document.type)({
        identifiantProjet: identifiantProjet,
        référenceDossierRaccordement: référenceDossier ?? document.référenceDossier,
        dateSignature: document.dateSignature,
        document: document.document,
      }),
    };
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    return mapToExemple<TransmettreDocument>(exemple, {
      dateSignature: ['La date de signature', mapDateTime],
      référenceDossier: ['La référence du dossier de raccordement'],
      type: [
        'type de document',
        mapValueType(Lauréat.Raccordement.TypeDocumentsRaccordement.convertirEnValueType),
      ],
    });
  }
}
