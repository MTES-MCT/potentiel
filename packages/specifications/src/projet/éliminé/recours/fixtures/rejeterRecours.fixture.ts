import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface RejeterRecours {
  readonly réponseSignée: { format: string; content: string };
  readonly rejetéLe: string;
  readonly rejetéPar: string;
}

export class RejeterRecoursFixture
  extends AbstractFixture<RejeterRecours>
  implements RejeterRecours
{
  #format!: string;
  #content!: string;

  get réponseSignée(): RejeterRecours['réponseSignée'] {
    return {
      format: this.#format,
      content: this.#content,
    };
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
    this.#format = fixture.réponseSignée.format;
    this.#content = fixture.réponseSignée.content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
