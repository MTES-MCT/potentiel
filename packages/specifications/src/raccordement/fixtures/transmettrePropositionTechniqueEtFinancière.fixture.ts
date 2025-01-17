import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../fixture';
import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';

type PièceJustificative = { format: string; content: ReadableStream };

interface TransmettrePropositionTechniqueEtFinancière {
  readonly dateSignature: string;
  readonly propositionTechniqueEtFinancièreSignée: PièceJustificative;
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
