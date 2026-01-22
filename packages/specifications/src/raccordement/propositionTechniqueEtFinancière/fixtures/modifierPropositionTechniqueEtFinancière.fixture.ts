import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../fixture.js';
import { convertStringToReadableStream } from '../../../helpers/convertStringToReadable.js';

type PièceJustificative = { format: string; content: ReadableStream };

interface ModifierPropositionTechniqueEtFinancière {
  dateSignature: string;
  référenceDossier: string;
  propositionTechniqueEtFinancièreSignée: PièceJustificative;
}

export class ModifierPropositionTechniqueEtFinancièreFixture
  extends AbstractFixture<ModifierPropositionTechniqueEtFinancière>
  implements ModifierPropositionTechniqueEtFinancière
{
  #dateSignature!: string;
  get dateSignature(): string {
    return this.#dateSignature;
  }

  #format!: string;
  #content!: string;

  get propositionTechniqueEtFinancièreSignée(): PièceJustificative {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
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
    partialFixture: Partial<Readonly<ModifierPropositionTechniqueEtFinancière>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<ModifierPropositionTechniqueEtFinancière> {
    const content = faker.word.words();
    const fixture = {
      dateSignature: faker.date.recent().toISOString(),
      propositionTechniqueEtFinancièreSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#dateSignature = fixture.dateSignature;
    this.#référenceDossier = fixture.référenceDossier;
    this.#format = fixture.propositionTechniqueEtFinancièreSignée.format;
    this.#content = content;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.aÉtéCréé = true;
    return fixture;
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    const values: Partial<ModifierPropositionTechniqueEtFinancière> = {};
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

  mapToExpected(référenceDossier?: string) {
    if (!this.aÉtéCréé) return;
    return {
      dateSignature: DateTime.convertirEnValueType(this.dateSignature),
      propositionTechniqueEtFinancièreSignée: DocumentProjet.convertirEnValueType(
        this.identifiantProjet,
        Lauréat.Raccordement.TypeDocumentRaccordement.convertirEnPropositionTechniqueEtFinancièreValueType(
          référenceDossier ?? this.référenceDossier,
        ).formatter(),
        this.#dateSignature,
        this.#format,
      ),
    };
  }
}
