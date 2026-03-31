import { faker } from '@faker-js/faker';

import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../../fixture.js';

interface DemanderChangementPuissance {
  readonly pièceJustificative: PièceJustificative;
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
  #pièceJustificative!: PièceJustificative;

  get pièceJustificative(): PièceJustificative {
    return this.#pièceJustificative;
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

    const fixture: DemanderChangementPuissance = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.company.catchPhrase(),
      pièceJustificative: faker.potentiel.document(),
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
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#ratioPuissance = fixture.ratioPuissance;
    this.#puissanceDeSite = fixture.puissanceDeSite;

    this.aÉtéCréé = true;

    return fixture;
  }
}
