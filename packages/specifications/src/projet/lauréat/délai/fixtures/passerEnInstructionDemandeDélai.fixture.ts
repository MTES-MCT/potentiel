import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface PasserEnInstructionDemandeDélai {
  readonly passéEnInstructionLe: string;
  readonly passéEnInstructionPar: string;
}

export class PasserEnInstructionDemandeDélaiFixture
  extends AbstractFixture<PasserEnInstructionDemandeDélai>
  implements PasserEnInstructionDemandeDélai
{
  #passéEnInstructionLe!: string;

  get passéEnInstructionLe(): string {
    return this.#passéEnInstructionLe;
  }

  #passéEnInstructionPar!: string;

  get passéEnInstructionPar(): string {
    return this.#passéEnInstructionPar;
  }

  créer(
    partialData?: Partial<Readonly<PasserEnInstructionDemandeDélai>>,
  ): Readonly<PasserEnInstructionDemandeDélai> {
    const fixture: PasserEnInstructionDemandeDélai = {
      passéEnInstructionLe: faker.date.soon().toISOString(),
      passéEnInstructionPar: faker.internet.email(),
      ...partialData,
    };

    this.#passéEnInstructionLe = fixture.passéEnInstructionLe;
    this.#passéEnInstructionPar = fixture.passéEnInstructionPar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
