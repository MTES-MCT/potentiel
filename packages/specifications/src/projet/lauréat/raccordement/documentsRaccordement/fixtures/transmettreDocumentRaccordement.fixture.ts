import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../../fixture.js';

export type TransmettreDocumentRaccordement = {
  dateSignature: string;
  référenceDossier: string;
  document: PièceJustificative;
  type: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
};

export class TransmettreDocumentRaccordementFixture
  extends AbstractFixture<TransmettreDocumentRaccordement>
  implements TransmettreDocumentRaccordement
{
  #dateSignature!: string;
  get dateSignature(): string {
    return this.#dateSignature;
  }

  #document!: PièceJustificative;
  get document(): PièceJustificative {
    return this.#document;
  }

  #type!: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
  get type(): Lauréat.Raccordement.TypeDocumentsRaccordement.RawType {
    return this.#type;
  }

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #référenceDossier!: string;
  get référenceDossier(): string {
    return this.#référenceDossier;
  }

  // document indexés par type
  #documentsRaccordement = new Map<string, TransmettreDocumentRaccordement>();
  #ajouterDocument(document: TransmettreDocumentRaccordement) {
    this.#documentsRaccordement.set(document.type, document);
  }
  getDocumentRaccordement(type: string) {
    return this.#documentsRaccordement.get(type);
  }

  créer(
    partialFixture: Partial<Readonly<TransmettreDocumentRaccordement>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<TransmettreDocumentRaccordement> {
    const fixture = {
      dateSignature: faker.date.recent().toISOString(),
      document: faker.potentiel.document(),
      type: Lauréat.Raccordement.TypeDocumentsRaccordement.propositionTechniqueEtFinancière.type,
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#dateSignature = fixture.dateSignature;
    this.#référenceDossier = fixture.référenceDossier;
    this.#document = fixture.document;
    this.#type = fixture.type;
    this.aÉtéCréé = true;

    this.#ajouterDocument(fixture);

    return fixture;
  }

  mapToExpected(type: string, référenceDossier?: string) {
    const document = this.getDocumentRaccordement(type);

    if (!document) return;

    return {
      dateSignature: DateTime.convertirEnValueType(document.dateSignature),
      document: Lauréat.Raccordement.DocumentRaccordement.documentRaccordement(document.type)({
        identifiantProjet: this.identifiantProjet,
        référenceDossierRaccordement: référenceDossier ?? document.référenceDossier,
        dateSignature: document.dateSignature,
        document: document.document,
      }),
    };
  }
}
