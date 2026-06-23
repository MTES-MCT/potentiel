import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../../fixture.js';

export type ModifierDocumentRaccordement = {
  dateSignature: string;
  référenceDossier: string;
  documentRaccordement: PièceJustificative;
  estUnNouveauDocument: boolean;
};

export class ModifierDocumentRaccordementFixture
  extends AbstractFixture<ModifierDocumentRaccordement>
  implements ModifierDocumentRaccordement
{
  #dateSignature!: string;
  get dateSignature(): string {
    return this.#dateSignature;
  }

  #documentRaccordement!: PièceJustificative;

  get documentRaccordement(): PièceJustificative {
    return this.#documentRaccordement;
  }

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }
  #référenceDossier!: string;
  get référenceDossier(): string {
    return this.#référenceDossier;
  }
  #estUnNouveauDocument!: boolean;
  get estUnNouveauDocument(): boolean {
    return this.#estUnNouveauDocument;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierDocumentRaccordement>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<ModifierDocumentRaccordement> {
    const fixture = {
      dateSignature: faker.date.recent().toISOString(),
      documentRaccordement: faker.potentiel.document(),
      estUnNouveauDocument: true,
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#dateSignature = fixture.dateSignature;
    this.#référenceDossier = fixture.référenceDossier;
    this.#documentRaccordement = fixture.documentRaccordement;
    this.#estUnNouveauDocument = fixture.estUnNouveauDocument;
    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected(référenceDossier?: string) {
    if (!this.aÉtéCréé) return;
    return {
      dateSignature: DateTime.convertirEnValueType(this.dateSignature),
      documentRaccordement:
        Lauréat.Raccordement.DocumentRaccordement.propositionTechniqueEtFinancière({
          identifiantProjet: this.identifiantProjet,
          référenceDossierRaccordement: référenceDossier ?? this.référenceDossier,
          dateSignature: this.#dateSignature,
          documentRaccordement: this.#documentRaccordement,
        }),
    };
  }
}
