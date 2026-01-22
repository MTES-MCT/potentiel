import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../../../fixture.js';

interface PasserMainlevéeEnInstruction {
  readonly démarréeLe: string;
  readonly démarréePar: string;
}

export class PasserMainlevéeEnInstructionFixture
  extends AbstractFixture<PasserMainlevéeEnInstruction>
  implements PasserMainlevéeEnInstruction
{
  #démarréeLe!: string;

  get démarréeLe(): string {
    return this.#démarréeLe;
  }

  #démarréePar!: string;

  get démarréePar(): string {
    return this.#démarréePar;
  }

  créer(
    partialData?: Partial<Readonly<PasserMainlevéeEnInstruction>>,
  ): Readonly<PasserMainlevéeEnInstruction> {
    const fixture: PasserMainlevéeEnInstruction = {
      démarréeLe: faker.date.soon().toISOString(),
      démarréePar: faker.internet.email(),
      ...partialData,
    };

    this.#démarréeLe = fixture.démarréeLe;
    this.#démarréePar = fixture.démarréePar;

    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected() {
    if (!this.aÉtéCréé) {
      return {};
    }
    const démarréeLe = DateTime.convertirEnValueType(this.démarréeLe);
    const démarréePar = Email.convertirEnValueType(this.démarréePar);
    return {
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.enInstruction,
      instruction: {
        démarréeLe,
        démarréePar,
      },
      dernièreMiseÀJour: {
        date: démarréeLe,
        par: démarréePar,
      },
    };
  }
}
