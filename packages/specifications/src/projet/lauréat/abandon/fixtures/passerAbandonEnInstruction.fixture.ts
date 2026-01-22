import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface PasserAbandonEnInstruction {
  readonly passéEnInstructionLe: string;
  readonly passéEnInstructionPar: string;
}

export class PasserAbandonEnInstructionFixture
  extends AbstractFixture<PasserAbandonEnInstruction>
  implements PasserAbandonEnInstruction
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
    partialData?: Partial<Readonly<PasserAbandonEnInstruction>>,
  ): Readonly<PasserAbandonEnInstruction> {
    const fixture: PasserAbandonEnInstruction = {
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
