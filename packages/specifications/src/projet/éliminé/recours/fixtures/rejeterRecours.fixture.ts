import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

type Document = { format: string; content: string };

interface RejeterRecours {
  readonly réponseSignée: Document;
  readonly rejetéLe: string;
  readonly rejetéPar: string;
}

export class RejeterRecoursFixture
  extends AbstractFixture<RejeterRecours>
  implements RejeterRecours
{
  #réponseSignée!: Document;

  get réponseSignée(): Document {
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
