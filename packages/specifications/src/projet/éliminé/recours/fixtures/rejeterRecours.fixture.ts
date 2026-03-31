import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface RejeterRecours {
  readonly réponseSignée: PièceJustificative;
  readonly rejetéLe: string;
  readonly rejetéPar: string;
}

export class RejeterRecoursFixture
  extends AbstractFixture<RejeterRecours>
  implements RejeterRecours
{
  #réponseSignée!: PièceJustificative;

  get réponseSignée(): PièceJustificative {
    return this.#réponseSignée;
  }

  #rejetéLe!: string;

  get rejetéLe(): string {
    return this.#rejetéLe;
  }

  #rejetéPar!: string;

  get rejetéPar(): string {
    return this.#rejetéPar;
  }

  créer(partialData?: Partial<RejeterRecours>): Readonly<RejeterRecours> {
    const fixture: RejeterRecours = {
      rejetéLe: faker.date.soon().toISOString(),
      rejetéPar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      ...partialData,
    };

    this.#rejetéLe = fixture.rejetéLe;
    this.#rejetéPar = fixture.rejetéPar;
    this.#réponseSignée = fixture.réponseSignée;

    this.aÉtéCréé = true;
    return fixture;
  }
}
