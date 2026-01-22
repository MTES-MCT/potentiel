import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../fixture.js';

export interface ModifierReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly dateModification: string;
  readonly raison: string;
}

export class ModifierReprésentantLégalFixture
  extends AbstractFixture<ModifierReprésentantLégal>
  implements ModifierReprésentantLégal
{
  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
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
    partialFixture?: Partial<Readonly<ModifierReprésentantLégal>>,
  ): Readonly<ModifierReprésentantLégal> {
    const fixture = {
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.inconnu,
      dateModification: faker.date.recent().toISOString(),
      raison: faker.word.words(),
      ...partialFixture,
    };

    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#typeReprésentantLégal = fixture.typeReprésentantLégal;
    this.#dateModification = fixture.dateModification;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;

    return fixture;
  }
}
