import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

export interface ModifierPuissance {
  readonly puissance: number;
  readonly dateModification: string;
  readonly raison: string;
}

export class ModifierPuissanceFixture
  extends AbstractFixture<ModifierPuissance>
  implements ModifierPuissance
{
  #puissance!: number;

  get puissance(): number {
    return this.#puissance;
  }

  #puissanceDeSite!: number;

  get puissanceDeSite(): number {
    return this.#puissanceDeSite;
  }

  #dateModification!: string;

  get dateModification(): string {
    return this.#dateModification;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  créer(partialFixture?: Partial<Readonly<ModifierPuissance>>): Readonly<ModifierPuissance> {
    const fixture = {
      puissance: faker.number.float({ min: 0.1, max: 3, multipleOf: 0.01 }),
      puissanceDeSite: faker.number.float({ min: 0.1, max: 3, multipleOf: 0.01 }),
      dateModification: faker.date.recent().toISOString(),
      raison: faker.company.catchPhrase(),
      ...partialFixture,
    };

    this.#puissance = fixture.puissance;
    this.#puissanceDeSite = fixture.puissanceDeSite;
    this.#dateModification = fixture.dateModification;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;

    return fixture;
  }
}
