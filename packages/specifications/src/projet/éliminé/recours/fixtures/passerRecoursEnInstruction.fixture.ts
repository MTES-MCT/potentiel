import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface PasserRecoursEnInstruction {
  readonly passéEnInstructionLe: string;
  readonly passéEnInstructionPar: string;
}

export class PasserRecoursEnInstructionFixture
  extends AbstractFixture<PasserRecoursEnInstruction>
  implements PasserRecoursEnInstruction
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
    partialData?: Partial<Readonly<PasserRecoursEnInstruction>>,
  ): Readonly<PasserRecoursEnInstruction> {
    const fixture: PasserRecoursEnInstruction = {
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
