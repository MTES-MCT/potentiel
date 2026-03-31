import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface AccorderRecours {
  readonly réponseSignée: { format: string; content: string };
  readonly accordéLe: string;
  readonly accordéPar: string;
}

export class AccorderRecoursFixture
  extends AbstractFixture<AccorderRecours>
  implements AccorderRecours
{
  #format!: string;
  #content!: string;

  get réponseSignée(): AccorderRecours['réponseSignée'] {
    return {
      format: this.#format,
      content: this.#content,
    };
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
      accordéLe: faker.date.soon().toISOString(),
      accordéPar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      ...partialData,
    };

    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéPar;
    this.#format = fixture.réponseSignée.format;
    this.#content = fixture.réponseSignée.content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
