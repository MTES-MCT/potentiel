import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../../fixture.js';

export type TransmettreDocumentRaccordement = {
  dateSignature: string;
  référenceDossier: string;
  document: PièceJustificative;
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

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }
  #référenceDossier!: string;
  get référenceDossier(): string {
    return this.#référenceDossier;
  }

  // vio : ajouter le type
  créer(
    partialFixture: Partial<Readonly<TransmettreDocumentRaccordement>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<TransmettreDocumentRaccordement> {
    const fixture = {
      dateSignature: faker.date.recent().toISOString(),
      document: faker.potentiel.document(),
      type,
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#dateSignature = fixture.dateSignature;
    this.#référenceDossier = fixture.référenceDossier;
    this.#document = fixture.document;
    this.aÉtéCréé = true;

    return fixture;
  }

  // vio : ajouter un type dans la query
  mapToExpected(référenceDossier?: string) {
    if (!this.aÉtéCréé) return;

    return {
      dateSignature: DateTime.convertirEnValueType(this.dateSignature),
      document: Lauréat.Raccordement.DocumentRaccordement.documentRaccordement({
        identifiantProjet: this.#identifiantProjet,
        référenceDossierRaccordement: référenceDossier ?? this.#référenceDossier,
        dateSignature: this.#dateSignature,
        document: this.#document,
      }),
    };
  }
}
