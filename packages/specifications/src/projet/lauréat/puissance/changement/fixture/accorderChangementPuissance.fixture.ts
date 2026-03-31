import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../../fixture.js';

export interface AccorderChangementPuissance {
  readonly réponseSignée: PièceJustificative;
  readonly accordéeLe: string;
  readonly accordéePar: string;
  readonly estUneDécisionDEtat: boolean;
}

export class AccorderChangementPuissanceFixture
  extends AbstractFixture<AccorderChangementPuissance>
  implements AccorderChangementPuissance
{
  #réponseSignée!: PièceJustificative;

  get réponseSignée(): PièceJustificative {
    return this.#réponseSignée;
  }

  #accordéeLe!: string;
  get accordéeLe(): string {
    return this.#accordéeLe;
  }

  #accordéePar!: string;
  get accordéePar(): string {
    return this.#accordéePar;
  }

  #estUneDécisionDEtat!: boolean;
  get estUneDécisionDEtat(): boolean {
    return this.#estUneDécisionDEtat;
  }

  créer(partialData?: Partial<AccorderChangementPuissance>): Readonly<AccorderChangementPuissance> {
    const fixture = {
      réponseSignée: faker.potentiel.document(),
      accordéeLe: faker.date.recent().toISOString(),
      accordéePar: faker.internet.email(),
      estUneDécisionDEtat: false,
      ...partialData,
    };

    this.#accordéeLe = fixture.accordéeLe;
    this.#accordéePar = fixture.accordéePar;
    this.#réponseSignée = fixture.réponseSignée;
    this.#estUneDécisionDEtat = fixture.estUneDécisionDEtat;

    this.aÉtéCréé = true;
    return fixture;
  }
}
