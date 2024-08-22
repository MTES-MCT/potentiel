import { faker } from '@faker-js/faker';

import { Fixture } from '../../../../fixture';

interface DemanderPreuveRecandidatureAbandon {
  demandéeLe: string;
}

export class DemanderPreuveRecandidatureAbandonFixture
  implements DemanderPreuveRecandidatureAbandon, Fixture<DemanderPreuveRecandidatureAbandon>
{
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #demandéeLe!: string;

  get demandéeLe(): string {
    return this.#demandéeLe;
  }

  set demandéeLe(value: string) {
    this.#demandéeLe = value;
  }

  créer(
    partialData?: Partial<Readonly<DemanderPreuveRecandidatureAbandon>>,
  ): Readonly<DemanderPreuveRecandidatureAbandon> {
    const fixture: DemanderPreuveRecandidatureAbandon = {
      demandéeLe: faker.date.soon().toISOString(),
      ...partialData,
    };

    this.#demandéeLe = fixture.demandéeLe;

    this.#aÉtéCréé = true;
    return fixture;
  }
}
