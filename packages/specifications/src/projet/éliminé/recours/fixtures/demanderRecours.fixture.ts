import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

type PièceJustificative = { format: string; content: string };

interface DemanderRecours {
  readonly pièceJustificative: PièceJustificative;
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
}

export class DemanderRecoursFixture
  extends AbstractFixture<DemanderRecours>
  implements DemanderRecours
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

  créer(partialData?: Partial<DemanderRecours>): Readonly<DemanderRecours> {
    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.word.words(),
      pièceJustificative: faker.potentiel.document(),
      ...partialData,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#pièceJustificative = fixture.pièceJustificative;

    this.aÉtéCréé = true;
    return fixture;
  }
}
