import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../fixture.js';

export type ModifierPropositionTechniqueEtFinancière = {
  dateSignature: string;
  référenceDossier: string;
  propositionTechniqueEtFinancièreSignée: PièceJustificative;
  estUnNouveauDocument: boolean;
};

export class ModifierPropositionTechniqueEtFinancièreFixture
  extends AbstractFixture<ModifierPropositionTechniqueEtFinancière>
  implements ModifierPropositionTechniqueEtFinancière
{
  #dateSignature!: string;
  get dateSignature(): string {
    return this.#dateSignature;
  }

  #propositionTechniqueEtFinancièreSignée!: PièceJustificative;

  get propositionTechniqueEtFinancièreSignée(): PièceJustificative {
    return this.#propositionTechniqueEtFinancièreSignée;
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
    partialFixture: Partial<Readonly<ModifierPropositionTechniqueEtFinancière>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<ModifierPropositionTechniqueEtFinancière> {
    const fixture = {
      dateSignature: faker.date.recent().toISOString(),
      propositionTechniqueEtFinancièreSignée: faker.potentiel.document(),
      estUnNouveauDocument: true,
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#dateSignature = fixture.dateSignature;
    this.#référenceDossier = fixture.référenceDossier;
    this.#propositionTechniqueEtFinancièreSignée = fixture.propositionTechniqueEtFinancièreSignée;
    this.#estUnNouveauDocument = fixture.estUnNouveauDocument;
    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected(référenceDossier?: string) {
    if (!this.aÉtéCréé) return;
    return {
      dateSignature: DateTime.convertirEnValueType(this.dateSignature),
      propositionTechniqueEtFinancièreSignée:
        Lauréat.Raccordement.DocumentRaccordement.propositionTechniqueEtFinancière({
          identifiantProjet: this.identifiantProjet,
          référenceDossierRaccordement: référenceDossier ?? this.référenceDossier,
          dateSignature: this.#dateSignature,
          propositionTechniqueEtFinancièreSignée: this.#propositionTechniqueEtFinancièreSignée,
        }),
    };
  }
}
