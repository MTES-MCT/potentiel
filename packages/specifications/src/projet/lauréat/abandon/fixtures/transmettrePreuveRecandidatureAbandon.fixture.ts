import { faker } from '@faker-js/faker';

import { Fixture } from '../../../../fixture';

interface TransmettrePreuveRecandidatureAbandon {
  preuveRecandidature: string;
  transmiseLe: string;
  transmisePar: string;
}

export class TransmettrePreuveRecandidatureAbandonFixture
  implements TransmettrePreuveRecandidatureAbandon, Fixture<TransmettrePreuveRecandidatureAbandon>
{
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #preuveRecandidature!: string;

  get preuveRecandidature(): string {
    return this.#preuveRecandidature;
  }

  set preuveRecandidature(value: string) {
    this.#preuveRecandidature = value;
  }

  #transmiseLe!: string;

  get transmiseLe(): string {
    return this.#transmiseLe;
  }

  set transmiseLe(value: string) {
    this.#transmiseLe = value;
  }

  #transmisePar!: string;

  get transmisePar(): string {
    return this.#transmisePar;
  }

  set transmisePar(value: string) {
    this.#transmisePar = value;
  }

  créer(
    partialData?: Partial<Readonly<TransmettrePreuveRecandidatureAbandon>> | undefined,
  ): Readonly<TransmettrePreuveRecandidatureAbandon> {
    const fixture: TransmettrePreuveRecandidatureAbandon = {
      transmiseLe: faker.date.soon().toISOString(),
      transmisePar: faker.internet.email(),
      preuveRecandidature: faker.potentiel.identifiantProjet(),
      ...partialData,
    };

    this.#transmiseLe = fixture.transmiseLe;
    this.#transmisePar = fixture.transmisePar;
    this.#preuveRecandidature = fixture.preuveRecandidature;

    this.#aÉtéCréé = true;
    return fixture;
  }
}
