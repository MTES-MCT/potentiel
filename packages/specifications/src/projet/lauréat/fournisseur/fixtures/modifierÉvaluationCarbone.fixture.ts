import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

export interface ModifierÉvaluationCarbone {
  readonly évaluationCarbone: number;
  readonly modifiéeLe: string;
  readonly modifiéePar: string;
}

export class ModifierÉvaluationCarboneFixture
  extends AbstractFixture<ModifierÉvaluationCarbone>
  implements ModifierÉvaluationCarbone
{
  #évaluationCarbone!: number;

  get évaluationCarbone(): number {
    return this.#évaluationCarbone;
  }

  #modifiéeLe!: string;

  get modifiéeLe(): string {
    return this.#modifiéeLe;
  }

  #modifiéePar!: string;

  get modifiéePar(): string {
    return this.#modifiéePar;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierÉvaluationCarbone>> & { modifiéePar: string },
  ): Readonly<ModifierÉvaluationCarbone> {
    const fixture = {
      modifiéeLe: faker.date.recent().toISOString(),
      évaluationCarbone: faker.number.float(),
      ...partialFixture,
    };

    this.#évaluationCarbone = fixture.évaluationCarbone;
    this.#modifiéeLe = fixture.modifiéeLe;
    this.#modifiéePar = fixture.modifiéePar;

    this.aÉtéCréé = true;

    return fixture;
  }
}
