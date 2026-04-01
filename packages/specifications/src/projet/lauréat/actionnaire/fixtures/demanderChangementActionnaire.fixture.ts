import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface DemanderChangementActionnaire {
  readonly pièceJustificative: PièceJustificative;
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
  readonly actionnaire: string;
}

export class DemanderChangementActionnaireFixture
  extends AbstractFixture<DemanderChangementActionnaire>
  implements DemanderChangementActionnaire
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

  #actionnaire!: string;

  get actionnaire(): string {
    return this.#actionnaire;
  }

  créer(
    partialData?: Partial<DemanderChangementActionnaire>,
  ): Readonly<DemanderChangementActionnaire> {
    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.company.catchPhrase(),
      pièceJustificative: faker.potentiel.document(),
      actionnaire: faker.company.name(),
      ...partialData,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#actionnaire = fixture.actionnaire;

    this.aÉtéCréé = true;
    return fixture;
  }
}
