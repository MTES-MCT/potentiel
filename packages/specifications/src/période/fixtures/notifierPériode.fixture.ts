import { faker } from '@faker-js/faker';

import { Candidature } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../fixture';

export type Candidat = {
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: Candidature.StatutCandidature.RawType;
  sociétéMère?: string;
  emailContact: string;
};

interface NotifierPériode {
  readonly estNotifiée: boolean;
  readonly notifiéeLe: string;
  readonly notifiéePar: string;
  readonly lauréats: Array<Candidat>;
  readonly éliminés: Array<Candidat>;
  readonly candidatsÀNotifier: {
    lauréats: Array<Candidat>;
    éliminés: Array<Candidat>;
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

  #lauréats!: Array<Candidat>;

  get lauréats(): NotifierPériode['lauréats'] {
    return this.#lauréats;
  }

  #candidatsÀNotifier!: NotifierPériode['candidatsÀNotifier'];

  get candidatsÀNotifier(): NotifierPériode['candidatsÀNotifier'] {
    return this.#candidatsÀNotifier;
  }

  #éliminés!: Array<Candidat>;

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

  ajouterCandidatsÀNotifier(lauréats: Candidat[], éliminés: Candidat[]) {
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
