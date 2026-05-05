import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../fixture.js';

export interface NotifierLauréat {
  readonly identifiantProjet: string;
  readonly nomProjet: string;
  readonly notifiéLe: string;
  readonly notifiéPar: string;
  readonly localité: Candidature.Localité.RawType;
  readonly coordonnées?: Candidature.Coordonnées.RawType;
}

export type NotifierLauréatProps = Partial<Readonly<NotifierLauréat>> & {
  identifiantProjet: string;
  notifiéPar: string;
};

export class NotifierLauréatFixture
  extends AbstractFixture<NotifierLauréat>
  implements NotifierLauréat
{
  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

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

  #localité!: NotifierLauréat['localité'];
  get localité(): NotifierLauréat['localité'] {
    return this.#localité;
  }

  #coordonnées!: NotifierLauréat['coordonnées'];
  get coordonnées(): NotifierLauréat['coordonnées'] {
    return this.#coordonnées;
  }

  créer(partialFixture: NotifierLauréatProps): Readonly<NotifierLauréat> {
    const fixture = {
      nomProjet: faker.person.fullName(),
      // une date de notification dans un passé assez proche pour ne pas dépasser les délais de réalisation du projet
      // et assez loin pour permettre d'avoir une date d'achèvement (passée) postérieure à la date de notification
      notifiéLe: faker.date
        .between({
          from: DateTime.now().retirerNombreDeMois(1).date,
          to: DateTime.now().retirerNombreDeJours(5).date,
        })
        .toISOString(),
      localité: {
        adresse1: faker.location.streetAddress(),
        adresse2: faker.location.streetAddress(),
        ...faker.potentiel.location(),
      },
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#nomProjet = fixture.nomProjet;
    this.#localité = fixture.localité;
    this.#coordonnées = fixture.coordonnées;
    this.#notifiéLe = fixture.notifiéLe;
    this.#notifiéPar = fixture.notifiéPar;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    if (!this.aÉtéCréé) {
      throw new Error("La fixture lauréat n'a pas été créee");
    }
    return {
      nomProjet: this.nomProjet,
      localité: Candidature.Localité.bind(this.localité),
      notifiéLe: DateTime.convertirEnValueType(this.notifiéLe),
      notifiéPar: Email.convertirEnValueType(this.notifiéPar),
      coordonnées: this.coordonnées ? Candidature.Coordonnées.bind(this.coordonnées) : undefined,
    };
  }
}
