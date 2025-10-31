import { faker } from '@faker-js/faker';

import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { AbstractFixture } from '../../../../fixture';

export interface ModifierPuissance {
  readonly puissance: number;
  readonly puissanceDeSite: number | undefined;
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

  #puissanceDeSite?: number;

  get puissanceDeSite(): number | undefined {
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

  créer(
    partialFixture?: Partial<Readonly<ModifierPuissance>> & { appelOffres?: string },
  ): Readonly<ModifierPuissance> {
    const aoData = appelsOffreData.find((x) => x.id === partialFixture?.appelOffres);

    const fixture = {
      puissance: faker.number.int({ min: 1 }),
      puissanceDeSite:
        aoData?.champsSupplémentaires?.puissanceDeSite === 'requis'
          ? faker.number.int({ min: 1 })
          : undefined,
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
