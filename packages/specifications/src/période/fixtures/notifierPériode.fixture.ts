import { faker } from '@faker-js/faker';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../fixture';

interface NotifierPériode {
  readonly estNotifiée: boolean;
  readonly notifiéeLe: string;
  readonly notifiéePar: string;
  readonly lauréats: Array<IdentifiantProjet.RawType>;
  readonly éliminés: Array<IdentifiantProjet.RawType>;
  readonly candidatsÀNotifier: {
    lauréats: Array<IdentifiantProjet.RawType>;
    éliminés: Array<IdentifiantProjet.RawType>;
  };
}

export class NotifierPériodeFixture
  extends AbstractFixture<NotifierPériode>
  implements NotifierPériode
{
  #estNotifiée!: boolean;

  get estNotifiée(): NotifierPériode['estNotifiée'] {
    return this.#estNotifiée;
  }

  #lauréats!: Array<IdentifiantProjet.RawType>;

  get lauréats(): NotifierPériode['lauréats'] {
    return this.#lauréats;
  }

  #candidatsÀNotifier!: NotifierPériode['candidatsÀNotifier'];

  get candidatsÀNotifier(): NotifierPériode['candidatsÀNotifier'] {
    return this.#candidatsÀNotifier;
  }

  #éliminés!: Array<IdentifiantProjet.RawType>;

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

  ajouterCandidatsÀNotifier(
    lauréats: IdentifiantProjet.RawType[],
    éliminés: IdentifiantProjet.RawType[],
  ) {
    this.#candidatsÀNotifier = {
      lauréats,
      éliminés,
    };
  }

  créer(partialFixture?: Partial<NotifierPériode>): NotifierPériode {
    const fixture: NotifierPériode = {
      estNotifiée: true,
      notifiéeLe: this.#notifiéeLe ?? faker.date.soon().toISOString(),
      notifiéePar: this.#notifiéePar ?? faker.internet.email(),
      lauréats: this.candidatsÀNotifier?.lauréats ?? [],
      éliminés: this.candidatsÀNotifier?.éliminés ?? [],
      candidatsÀNotifier: { lauréats: [], éliminés: [] },
      ...partialFixture,
    };

    this.#notifiéeLe = fixture.notifiéeLe;
    this.#notifiéePar = fixture.notifiéePar;
    this.#lauréats = fixture.lauréats;
    this.#éliminés = fixture.éliminés;

    this.aÉtéCréé = true;
    this.#candidatsÀNotifier = { lauréats: [], éliminés: [] };

    return fixture;
  }
}
