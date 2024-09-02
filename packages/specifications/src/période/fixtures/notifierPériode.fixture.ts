import { faker } from '@faker-js/faker';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { AbstractFixture } from '../../fixture';

interface NotifierPériode {
  readonly estNotifiée: boolean;
  readonly notifiéeLe: string;
  readonly notifiéePar: string;
  readonly lauréats: Array<IdentifiantProjet.RawType>;
  readonly éliminés: Array<IdentifiantProjet.RawType>;
}

export class NotifierPériodeFixture
  extends AbstractFixture<NotifierPériode>
  implements NotifierPériode
{
  #estNotifiée!: boolean;

  get estNotifiée(): NotifierPériode['estNotifiée'] {
    return this.#estNotifiée;
  }

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
      estNotifiée: true,
      notifiéeLe: faker.date.soon().toISOString(),
      notifiéePar: faker.internet.email(),
      lauréats: [
        'PPE2 - Eolien#1##lauréat-1' as IdentifiantProjet.RawType,
        'PPE2 - Eolien#1##lauréat-2' as IdentifiantProjet.RawType,
        'PPE2 - Eolien#1##lauréat-3' as IdentifiantProjet.RawType,
        'PPE2 - Eolien#1##lauréat-4' as IdentifiantProjet.RawType,
        'PPE2 - Eolien#1##lauréat-5' as IdentifiantProjet.RawType,
      ],
      éliminés: [
        'PPE2 - Eolien#1##éliminé-1' as IdentifiantProjet.RawType,
        'PPE2 - Eolien#1##éliminé-2' as IdentifiantProjet.RawType,
        'PPE2 - Eolien#1##éliminé-3' as IdentifiantProjet.RawType,
      ],
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
