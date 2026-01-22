import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../fixture.js';

export interface NotifierÉliminé {
  readonly identifiantProjet: string;
  readonly notifiéLe: string;
  readonly notifiéPar: string;
}

export type NotifierÉliminéProps = Partial<Readonly<NotifierÉliminé>> & {
  identifiantProjet: string;
  notifiéPar: string;
};

export class NotifierÉliminéFixture
  extends AbstractFixture<NotifierÉliminé>
  implements NotifierÉliminé
{
  #identifiantProjet!: string;

  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #notifiéLe!: string;

  get notifiéLe(): string {
    return this.#notifiéLe;
  }

  #notifiéPar!: string;

  get notifiéPar(): string {
    return this.#notifiéPar;
  }

  créer(partialFixture: NotifierÉliminéProps): Readonly<NotifierÉliminé> {
    const fixture = {
      notifiéLe: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
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
