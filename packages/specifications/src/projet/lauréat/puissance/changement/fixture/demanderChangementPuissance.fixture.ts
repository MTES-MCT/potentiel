import { faker } from '@faker-js/faker';

import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { AbstractFixture } from '../../../../../fixture';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

interface DemanderChangementPuissance {
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
  readonly ratioPuissance: number;
  readonly puissanceDeSite?: number;
}

export class DemanderChangementPuissanceFixture
  extends AbstractFixture<DemanderChangementPuissance>
  implements DemanderChangementPuissance
{
  #format!: string;
  #content!: string;

  get pièceJustificative(): DemanderChangementPuissance['pièceJustificative'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #demandéLe!: string;

  get demandéLe(): string {
    return this.#demandéLe;
  }

  #demandéPar!: string;

  get demandéPar(): string {
    return this.#demandéPar;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  #ratioPuissance!: number;

  get ratioPuissance(): number {
    return this.#ratioPuissance;
  }

  #puissanceDeSite?: number;

  get puissanceDeSite(): number | undefined {
    return this.#puissanceDeSite;
  }

  créer(
    partialData?: Partial<DemanderChangementPuissance> & {
      ratioPuissance: number;
      appelOffres?: string;
    },
  ): Readonly<DemanderChangementPuissance> {
    const aoData = appelsOffreData.find((x) => x.id === partialData?.appelOffres);

    const content = faker.word.words();

    const fixture: DemanderChangementPuissance = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.company.catchPhrase(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ratioPuissance: faker.number.float({ min: 0.5, max: 2, multipleOf: 0.01 }),
      puissanceDeSite:
        aoData?.champsSupplémentaires?.puissanceDeSite === 'requis'
          ? faker.number.int({ min: 1, max: 100 })
          : undefined,
      ...partialData,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#ratioPuissance = fixture.ratioPuissance;
    this.#puissanceDeSite = fixture.puissanceDeSite;

    this.aÉtéCréé = true;

    return fixture;
  }
}
