import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

export interface ModifierÉvaluationCarbone {
  readonly évaluationCarbone: number;
  readonly modifiéLe: string;
  readonly modifiéPar: string;
}

export class ModifierÉvaluationCarboneFixture
  extends AbstractFixture<ModifierÉvaluationCarbone>
  implements ModifierÉvaluationCarbone
{
  #évaluationCarbone!: number;

  get évaluationCarbone(): number {
    return this.#évaluationCarbone;
  }

  #modifiéLe!: string;

  get modifiéLe(): string {
    return this.#modifiéLe;
  }

  #modifiéPar!: string;

  get modifiéPar(): string {
    return this.#modifiéPar;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierÉvaluationCarbone>> & { modifiéPar: string },
  ): Readonly<ModifierÉvaluationCarbone> {
    const fixture = {
      modifiéLe: faker.date.recent().toISOString(),
      évaluationCarbone: faker.number.float(),
      ...partialFixture,
    };

    this.#évaluationCarbone = fixture.évaluationCarbone;
    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;

    this.aÉtéCréé = true;

    return fixture;
  }
}
