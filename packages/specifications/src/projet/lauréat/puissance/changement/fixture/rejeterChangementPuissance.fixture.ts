import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../../fixture.js';

export interface RejeterChangementPuissance {
  readonly réponseSignée: PièceJustificative;
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
  readonly estUneDécisionDEtat: boolean;
}

export class RejeterChangementPuissanceFixture
  extends AbstractFixture<RejeterChangementPuissance>
  implements RejeterChangementPuissance
{
  #format!: string;
  #content!: string;

  get réponseSignée(): RejeterChangementPuissance['réponseSignée'] {
    return {
      format: this.#format,
      content: this.#content,
    };
  }

  #rejetéeLe!: string;
  get rejetéeLe(): string {
    return this.#rejetéeLe;
  }

  #rejetéePar!: string;
  get rejetéePar(): string {
    return this.#rejetéePar;
  }

  #estUneDécisionDEtat!: boolean;
  get estUneDécisionDEtat(): boolean {
    return this.#estUneDécisionDEtat;
  }

  créer(partialData?: Partial<RejeterChangementPuissance>): Readonly<RejeterChangementPuissance> {
    const content = faker.word.words();

    const fixture = {
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content,
      },
      rejetéeLe: faker.date.recent().toISOString(),
      rejetéePar: faker.internet.email(),
      estUneDécisionDEtat: false,
      ...partialData,
    };

    this.#rejetéeLe = fixture.rejetéeLe;
    this.#rejetéePar = fixture.rejetéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;
    this.#estUneDécisionDEtat = fixture.estUneDécisionDEtat;

    this.aÉtéCréé = true;
    return fixture;
  }
}
