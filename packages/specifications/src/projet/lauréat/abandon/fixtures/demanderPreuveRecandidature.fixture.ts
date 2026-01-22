import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface DemanderPreuveRecandidatureAbandon {
  readonly demandéeLe: string;
}

export class DemanderPreuveRecandidatureAbandonFixture
  extends AbstractFixture<DemanderPreuveRecandidatureAbandon>
  implements DemanderPreuveRecandidatureAbandon
{
  #demandéeLe!: string;

  get demandéeLe(): string {
    return this.#demandéeLe;
  }

  créer(
    partialData?: Partial<Readonly<DemanderPreuveRecandidatureAbandon>>,
  ): Readonly<DemanderPreuveRecandidatureAbandon> {
    const fixture: DemanderPreuveRecandidatureAbandon = {
      demandéeLe: faker.date.soon().toISOString(),
      ...partialData,
    };

    this.#demandéeLe = fixture.demandéeLe;

    this.aÉtéCréé = true;
    return fixture;
  }
}
