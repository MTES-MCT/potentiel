import { faker } from '@faker-js/faker';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { AbstractFixture } from '../../../../../fixture';

interface AccorderChangementReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly accordéeLe: string;
  readonly accordéePar: string;
}

export class AccorderChangementReprésentantLégalFixture
  extends AbstractFixture<AccorderChangementReprésentantLégal>
  implements AccorderChangementReprésentantLégal
{
  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
  }

  #accordéLe!: string;

  get accordéeLe(): string {
    return this.#accordéLe;
  }

  #accordéPar!: string;

  get accordéePar(): string {
    return this.#accordéPar;
  }

  créer(
    partialFixture?: Partial<AccorderChangementReprésentantLégal>,
  ): AccorderChangementReprésentantLégal {
    const fixture: AccorderChangementReprésentantLégal = {
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.personnePhysique,
      accordéeLe: faker.date.soon().toISOString(),
      accordéePar: faker.internet.email(),
      ...partialFixture,
    };

    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#typeReprésentantLégal = fixture.typeReprésentantLégal;
    this.#accordéLe = fixture.accordéeLe;
    this.#accordéPar = fixture.accordéePar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
