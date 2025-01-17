import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';

import { AbstractFixture } from '../../fixture';

interface TransmettreDateDeMiseEnService {
  readonly dateMiseEnService: string;
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

  créer(
    partialFixture: Partial<Readonly<TransmettreDateDeMiseEnService>> & {
      référenceDossier: string;
      identifiantProjet: string;
    },
  ): Readonly<TransmettreDateDeMiseEnService> {
    const fixture = {
      dateMiseEnService: faker.date.recent().toISOString(),
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
}
