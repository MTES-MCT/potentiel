import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface PasserAbandonEnInstruction {
  readonly instruitLe: string;
  readonly instruitPar: string;
}

export class PasserAbandonEnInstructionFixture
  extends AbstractFixture<PasserAbandonEnInstruction>
  implements PasserAbandonEnInstruction
{
  #instruitLe!: string;

  get instruitLe(): string {
    return this.#instruitLe;
  }

  #instruitPar!: string;

  get instruitPar(): string {
    return this.#instruitPar;
  }

  créer(
    partialData?: Partial<Readonly<PasserAbandonEnInstruction>>,
  ): Readonly<PasserAbandonEnInstruction> {
    const fixture: PasserAbandonEnInstruction = {
      instruitLe: faker.date.soon().toISOString(),
      instruitPar: faker.internet.email(),
      ...partialData,
    };

    this.#instruitLe = fixture.instruitLe;
    this.#instruitPar = fixture.instruitPar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
