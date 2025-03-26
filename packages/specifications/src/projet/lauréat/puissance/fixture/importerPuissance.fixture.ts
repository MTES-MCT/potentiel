import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface ImporterPuissance {
  readonly puissance: number;
  readonly importéeLe: string;
}

export class ImporterPuissanceFixture
  extends AbstractFixture<ImporterPuissance>
  implements ImporterPuissance
{
  #puissance!: number;

  get puissance(): number {
    return this.#puissance;
  }

  #importéeLe!: string;

  get importéeLe(): string {
    return this.#importéeLe;
  }

  créer(partialFixture?: Partial<Readonly<ImporterPuissance>>): Readonly<ImporterPuissance> {
    const fixture = {
      puissance: faker.number.float({ min: 0.1, max: 3 }),
      importéeLe: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#puissance = fixture.puissance;
    this.#importéeLe = fixture.importéeLe;

    this.aÉtéCréé = true;

    return fixture;
  }
}
