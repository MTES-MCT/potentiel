import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../fixture';

interface NotifierÉliminé {
  readonly nomProjet: string;
  readonly notifiéLe: string;
  readonly notifiéPar: string;
}

export class NotifierÉliminéFixture
  extends AbstractFixture<NotifierÉliminé>
  implements NotifierÉliminé
{
  #nomProjet!: string;

  get nomProjet(): string {
    return this.#nomProjet;
  }

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
      nomProjet: faker.person.fullName(),
      notifiéLe: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#nomProjet = fixture.nomProjet;
    this.#notifiéLe = fixture.notifiéLe;
    this.#notifiéPar = fixture.notifiéPar;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    if (!this.aÉtéCréé) {
      throw new Error("La fixture notifier éliminé n'a pas été créee");
    }
    return {
      notifiéLe: DateTime.convertirEnValueType(this.notifiéLe),
      notifiéPar: Email.convertirEnValueType(this.notifiéPar),
    };
  }
}
