import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Raccordement } from '@potentiel-domain/reseau';

import { AbstractFixture } from '../../fixture';
import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';

type PièceJustificative = { format: string; content: ReadableStream };

interface ModifierPropositionTechniqueEtFinancière {
  readonly dateSignature: string;
  readonly propositionTechniqueEtFinancièreSignée: PièceJustificative;
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

  mapToExpected(référenceDossier?: string) {
    if (!this.aÉtéCréé) return;
    return {
      dateSignature: DateTime.convertirEnValueType(this.dateSignature),
      propositionTechniqueEtFinancièreSignée: DocumentProjet.convertirEnValueType(
        this.identifiantProjet,
        Raccordement.TypeDocumentRaccordement.convertirEnPropositionTechniqueEtFinancièreValueType(
          référenceDossier ?? this.référenceDossier,
        ).formatter(),
        this.#dateSignature,
        this.#format,
      ),
    };
  }
}
