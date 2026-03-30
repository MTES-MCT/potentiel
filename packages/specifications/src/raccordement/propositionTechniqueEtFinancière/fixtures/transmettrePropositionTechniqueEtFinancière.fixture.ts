import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../fixture.js';

export type PièceJustificative = { format: string; content: string };

interface TransmettrePropositionTechniqueEtFinancière {
  dateSignature: string;
  référenceDossier: string;
  propositionTechniqueEtFinancièreSignée: PièceJustificative;
}

export class TransmettrePropositionTechniqueEtFinancièreFixture
  extends AbstractFixture<TransmettrePropositionTechniqueEtFinancière>
  implements TransmettrePropositionTechniqueEtFinancière
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

  créer(
    partialFixture: Partial<Readonly<TransmettrePropositionTechniqueEtFinancière>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<TransmettrePropositionTechniqueEtFinancière> {
    const fixture = {
      dateSignature: faker.date.recent().toISOString(),
      propositionTechniqueEtFinancièreSignée: {
        format: faker.potentiel.fileFormat(),
        content: faker.word.words(),
      },
      ...partialFixture,
    };

    this.#dateSignature = fixture.dateSignature;
    this.#référenceDossier = fixture.référenceDossier;
    this.#propositionTechniqueEtFinancièreSignée = fixture.propositionTechniqueEtFinancièreSignée;
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
          référence: référenceDossier ?? this.référenceDossier,
          dateSignature: this.#dateSignature,
          propositionTechniqueEtFinancièreSignée: this.#propositionTechniqueEtFinancièreSignée,
        }),
    };
  }
  mapExempleToFixtureValues(exemple: Record<string, string>) {
    const values: Partial<TransmettrePropositionTechniqueEtFinancière> = {};
    const dateSignature = exemple['La date de signature'];
    const référenceDossier = exemple['La référence du dossier de raccordement'];
    if (dateSignature) {
      values.dateSignature = new Date(dateSignature).toISOString();
    }
    if (référenceDossier) {
      values.référenceDossier = référenceDossier;
    }
    return values;
  }
}
