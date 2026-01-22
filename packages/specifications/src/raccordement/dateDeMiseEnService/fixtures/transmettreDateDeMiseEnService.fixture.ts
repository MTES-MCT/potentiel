import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../fixture.js';
import { RaccordementWorld } from '../../raccordement.world.js';

interface TransmettreDateDeMiseEnService {
  dateMiseEnService: string;
  référenceDossier: string;
}

export class TransmettreDateMiseEnServiceFixture
  extends AbstractFixture<TransmettreDateDeMiseEnService>
  implements TransmettreDateDeMiseEnService
{
  #dateMiseEnService!: string;
  get dateMiseEnService(): string {
    return this.#dateMiseEnService;
  }

  #référenceDossier!: string;
  get référenceDossier(): string {
    return this.#référenceDossier;
  }

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  constructor(private raccordementWorld: RaccordementWorld) {
    super();
  }

  créer(
    partialFixture: Partial<Readonly<TransmettreDateDeMiseEnService>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<TransmettreDateDeMiseEnService> {
    const fixture = {
      dateMiseEnService: faker.date
        .between({
          from: this.raccordementWorld.lauréatWorld.notifierLauréatFixture.notifiéLe,
          to: new Date(),
        })
        .toISOString(),
      ...partialFixture,
    };

    this.#référenceDossier = fixture.référenceDossier;
    this.#dateMiseEnService = fixture.dateMiseEnService;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected() {
    if (!this.aÉtéCréé) {
      return;
    }
    return { dateMiseEnService: DateTime.convertirEnValueType(this.dateMiseEnService) };
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    const values: Partial<TransmettreDateDeMiseEnService> = {};
    const référenceDossier = exemple['La référence du dossier de raccordement'];
    const dateMiseEnService = exemple['La date de mise en service'];
    if (référenceDossier) {
      values.référenceDossier = référenceDossier;
    }
    if (dateMiseEnService) {
      values.dateMiseEnService = new Date(dateMiseEnService).toISOString();
    }
    return values;
  }
}
