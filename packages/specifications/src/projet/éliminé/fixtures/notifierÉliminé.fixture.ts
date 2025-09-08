import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../fixture';

interface NotifierÉliminé {
  readonly notifiéLe: string;
  readonly notifiéPar: string;
}

export class NotifierÉliminéFixture
  extends AbstractFixture<NotifierÉliminé>
  implements NotifierÉliminé
{
  #notifiéLe!: string;

  get notifiéLe(): string {
    return this.#notifiéLe;
  }

  #notifiéPar!: string;

  get notifiéPar(): string {
    return this.#notifiéPar;
  }

  créer(
    partialFixture: Partial<Readonly<NotifierÉliminé>> & { notifiéPar: string },
  ): Readonly<NotifierÉliminé> {
    const fixture = {
      notifiéLe: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#notifiéLe = fixture.notifiéLe;
    this.#notifiéPar = fixture.notifiéPar;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    if (!this.aÉtéCréé) {
      throw new Error("La fixture notifier éliminée n'a pas été créee");
    }
    return {
      notifiéLe: DateTime.convertirEnValueType(this.notifiéLe),
      notifiéPar: Email.convertirEnValueType(this.notifiéPar),
    };
  }
}
