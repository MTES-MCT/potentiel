import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface TransmettrePreuveRecandidatureAbandon {
  readonly preuveRecandidature: string;
  readonly transmiseLe: string;
  readonly transmisePar: string;
}

export class TransmettrePreuveRecandidatureAbandonFixture
  extends AbstractFixture<TransmettrePreuveRecandidatureAbandon>
  implements TransmettrePreuveRecandidatureAbandon
{
  #preuveRecandidature!: string;

  get preuveRecandidature(): string {
    return this.#preuveRecandidature;
  }

  #transmiseLe!: string;

  get transmiseLe(): string {
    return this.#transmiseLe;
  }

  #transmisePar!: string;

  get transmisePar(): string {
    return this.#transmisePar;
  }

  créer(
    partialData?: Partial<Readonly<TransmettrePreuveRecandidatureAbandon>> | undefined,
  ): Readonly<TransmettrePreuveRecandidatureAbandon> {
    const fixture: TransmettrePreuveRecandidatureAbandon = {
      transmiseLe: faker.date
        .between({
          from: '2023-12-15',
          to: '2024-01-01',
        })
        .toISOString(),
      transmisePar: faker.internet.email(),
      preuveRecandidature: faker.potentiel.identifiantProjet(),
      ...partialData,
    };

    this.#transmiseLe = fixture.transmiseLe;
    this.#transmisePar = fixture.transmisePar;
    this.#preuveRecandidature = fixture.preuveRecandidature;

    this.aÉtéCréé = true;
    return fixture;
  }
}
