import { faker } from '@faker-js/faker';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';

interface AccorderRecours {
  readonly réponseSignée: PièceJustificative;
  readonly dateAccord: string;
  readonly accordéLe: string;
  readonly accordéPar: string;
}

export class AccorderRecoursFixture
  extends AbstractFixture<AccorderRecours>
  implements AccorderRecours
{
  #réponseSignée!: PièceJustificative;

  get réponseSignée(): PièceJustificative {
    return this.#réponseSignée;
  }

  #dateAccord!: string;

  get dateAccord(): string {
    return this.#dateAccord;
  }

  #accordéLe!: string;

  get accordéLe(): string {
    return this.#accordéLe;
  }

  #accordéPar!: string;

  get accordéPar(): string {
    return this.#accordéPar;
  }

  créer(partialData?: Partial<AccorderRecours>): Readonly<AccorderRecours> {
    const fixture: AccorderRecours = {
      dateAccord: faker.date.past().toISOString(),
      accordéLe: faker.date.soon().toISOString(),
      accordéPar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      ...partialData,
    };

    this.#dateAccord = fixture.dateAccord;
    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéPar;
    this.#réponseSignée = fixture.réponseSignée;

    this.aÉtéCréé = true;
    return fixture;
  }
}
