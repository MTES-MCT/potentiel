import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../../fixture.js';

export type ModifierDocumentRaccordement = {
  dateSignature: string;
  référenceDossier: string;
  document: PièceJustificative;
};

export class ModifierDocumentRaccordementFixture
  extends AbstractFixture<ModifierDocumentRaccordement>
  implements ModifierDocumentRaccordement
{
  #dateSignature!: string;
  get dateSignature(): string {
    return this.#dateSignature;
  }

  #document!: PièceJustificative;
  get document(): PièceJustificative {
    return this.#document;
  }

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #référenceDossier!: string;
  get référenceDossier(): string {
    return this.#référenceDossier;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierDocumentRaccordement>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<ModifierDocumentRaccordement> {
    const fixture = {
      dateSignature: faker.date.recent().toISOString(),
      document: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#dateSignature = fixture.dateSignature;
    this.#référenceDossier = fixture.référenceDossier;
    this.#document = fixture.document;
    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected(
    type: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType,
    référenceDossier?: string,
  ) {
    if (!this.aÉtéCréé) return;

    return {
      dateSignature: DateTime.convertirEnValueType(this.dateSignature),
      document: Lauréat.Raccordement.DocumentRaccordement.documentRaccordement(type)({
        identifiantProjet: this.#identifiantProjet,
        référenceDossierRaccordement: référenceDossier ?? this.#référenceDossier,
        dateSignature: this.#dateSignature,
        document: this.#document,
      }),
    };
  }
}
