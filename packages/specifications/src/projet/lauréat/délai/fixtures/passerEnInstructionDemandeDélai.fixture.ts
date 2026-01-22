import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface PasserEnInstructionDemandeDélai {
  readonly passéeEnInstructionLe: string;
  readonly passéeEnInstructionPar: string;
}

export class PasserEnInstructionDemandeDélaiFixture
  extends AbstractFixture<PasserEnInstructionDemandeDélai>
  implements PasserEnInstructionDemandeDélai
{
  #passéeEnInstructionLe!: string;

  get passéeEnInstructionLe(): string {
    return this.#passéeEnInstructionLe;
  }

  #passéeEnInstructionPar!: string;

  get passéeEnInstructionPar(): string {
    return this.#passéeEnInstructionPar;
  }

  créer(
    partialData?: Partial<Readonly<PasserEnInstructionDemandeDélai>>,
  ): Readonly<PasserEnInstructionDemandeDélai> {
    const fixture: PasserEnInstructionDemandeDélai = {
      passéeEnInstructionLe: faker.date.soon().toISOString(),
      passéeEnInstructionPar: faker.internet.email(),
      ...partialData,
    };

    this.#passéeEnInstructionLe = fixture.passéeEnInstructionLe;
    this.#passéeEnInstructionPar = fixture.passéeEnInstructionPar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
