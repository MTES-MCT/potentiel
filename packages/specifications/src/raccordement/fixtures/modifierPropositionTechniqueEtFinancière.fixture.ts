import { faker } from '@faker-js/faker';

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
    this.#propositionTechniqueEtFinancièreSignée = fixture.propositionTechniqueEtFinancièreSignée;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.aÉtéCréé = true;
    return fixture;
  }
}
