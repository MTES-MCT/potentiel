import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../fixture';
import { getFakeLocation } from '../../../helpers/getFakeLocation';

export interface NotifierLauréat {
  readonly nomProjet: string;
  readonly notifiéLe: string;
  readonly notifiéPar: string;
  readonly localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
  };
}

export class NotifierLauréatFixture
  extends AbstractFixture<NotifierLauréat>
  implements NotifierLauréat
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

  #localité!: NotifierLauréat['localité'];

  get localité(): NotifierLauréat['localité'] {
    return this.#localité;
  }

  créer(
    partialFixture: Partial<Readonly<NotifierLauréat>> & { notifiéPar: string },
  ): Readonly<NotifierLauréat> {
    const fixture = {
      nomProjet: faker.person.fullName(),
      notifiéLe: faker.date.recent().toISOString(),
      localité: {
        adresse1: faker.location.streetAddress(),
        adresse2: faker.location.streetAddress(),
        ...getFakeLocation(),
      },
      ...partialFixture,
    };

    this.#nomProjet = fixture.nomProjet;
    this.#localité = fixture.localité;
    this.#notifiéLe = fixture.notifiéLe;
    this.#notifiéPar = fixture.notifiéPar;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    if (!this.aÉtéCréé) {
      return {};
    }
    return {
      nomProjet: this.nomProjet,
      localité: this.localité,
      notifiéLe: DateTime.convertirEnValueType(this.notifiéLe),
      notifiéPar: Email.convertirEnValueType(this.notifiéPar),
    };
  }
}
