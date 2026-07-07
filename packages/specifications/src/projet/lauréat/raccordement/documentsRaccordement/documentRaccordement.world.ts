import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { mapDateTime, mapToExemple, mapValueType } from '#helpers';
import {
  type ModifierDocumentRaccordement,
  ModifierDocumentRaccordementFixture,
} from './fixtures/modifierDocumentRaccordement.fixture.js';
import {
  type SupprimerDocumentRaccordement,
  SupprimerDocumentRaccordementFixture,
} from './fixtures/supprimerDocumentRaccordement.fixture.js';
import {
  type TransmettreDocumentRaccordement,
  TransmettreDocumentRaccordementFixture,
} from './fixtures/transmettreDocumentRaccordement.fixture.js';

export class DocumentRaccordementWorld {
  // Stocker les documents par type
  #documentsRaccordement = new Map<
    string,
    TransmettreDocumentRaccordement | ModifierDocumentRaccordement
  >();

  ajouterDocument(document: TransmettreDocumentRaccordement | ModifierDocumentRaccordement) {
    this.#documentsRaccordement.set(document.type, document);
  }

  supprimerDocument(document: SupprimerDocumentRaccordement) {
    this.#documentsRaccordement.delete(document.type);
  }

  getDocumentRaccordement(type: string) {
    return this.#documentsRaccordement.get(type);
  }

  readonly transmettreFixture = new TransmettreDocumentRaccordementFixture(this);
  readonly modifierFixture = new ModifierDocumentRaccordementFixture(this);
  readonly supprimerFixture = new SupprimerDocumentRaccordementFixture(this);

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
