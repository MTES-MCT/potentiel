import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';

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

  créer(
    partialData: Partial<AccorderRecours> & {
      dateAccordSpécifique: string | undefined;
      dateNotification: string;
    },
  ): Readonly<AccorderRecours> {
    const fixture: AccorderRecours = {
      accordéLe: faker.date.soon().toISOString(),
      accordéPar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      ...partialData,
      dateAccord:
        partialData.dateAccordSpécifique ??
        faker.date
          .between({
            from: new Date(partialData.dateNotification),
            to: new Date(),
          })
          .toISOString(),
    };

    this.#dateAccord = fixture.dateAccord;
    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéPar;
    this.#réponseSignée = fixture.réponseSignée;

    this.aÉtéCréé = true;
    return fixture;
  }
  mapToExpectedLauréat() {
    if (!this.aÉtéCréé) {
      return {};
    }
    return {
      notifiéLe: DateTime.convertirEnValueType(this.dateAccord),
      notifiéPar: Email.convertirEnValueType(this.accordéPar),
    };
  }
}
