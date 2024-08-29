import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../fixture';

interface NotifierPériode {
  readonly lauréats: Array<string>;
  readonly éliminés: Array<string>;
  readonly notifiéeLe: string;
  readonly notifiéePar: string;
}

export class NotifierPériodeFixture
  extends AbstractFixture<NotifierPériode>
  implements NotifierPériode
{
  #identifiantPériode!: string;

  #lauréats!: Array<string>;

  get lauréats(): NotifierPériode['lauréats'] {
    return this.#lauréats;
  }

  #éliminés!: Array<string>;
  get éliminés(): NotifierPériode['éliminés'] {
    return this.#éliminés;
  }

  #notifiéeLe!: string;

  get notifiéeLe(): string {
    return this.#notifiéeLe;
  }

  #notifiéePar!: string;

  get notifiéePar(): string {
    return this.#notifiéePar;
  }

  créer(partialFixture?: Partial<NotifierPériode>): NotifierPériode {
    const fixture: NotifierPériode = {
      notifiéeLe: faker.date.soon().toISOString(),
      notifiéePar: faker.internet.email(),
      lauréats: [],
      éliminés: [],
      ...partialFixture,
    };

    this.#notifiéeLe = fixture.notifiéeLe;
    this.#notifiéePar = fixture.notifiéePar;
    this.#lauréats = fixture.lauréats;
    this.#éliminés = fixture.éliminés;

    this.aÉtéCréé = true;
    return fixture;
  }
}
