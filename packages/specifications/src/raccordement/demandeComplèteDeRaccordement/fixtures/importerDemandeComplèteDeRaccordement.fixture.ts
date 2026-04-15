import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../fixture.js';

export type ImporterDemandeComplèteRaccordement = {
  dateQualification: string;
  référenceDossier: string;
};

export class ImporterDemandeComplèteRaccordementFixture
  extends AbstractFixture<ImporterDemandeComplèteRaccordement>
  implements ImporterDemandeComplèteRaccordement
{
  #dateQualification!: string;
  get dateQualification(): string {
    return this.#dateQualification;
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
    partialFixture: Partial<Readonly<ImporterDemandeComplèteRaccordement>> & {
      identifiantProjet: string;
    },
  ): Readonly<ImporterDemandeComplèteRaccordement> {
    const fixture = {
      dateQualification: faker.date.recent().toISOString(),
      référenceDossier: faker.commerce.isbn(),
      ...partialFixture,
    };

    this.#dateQualification = fixture.dateQualification;
    this.#référenceDossier = fixture.référenceDossier;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected(référenceDossier?: string) {
    if (!this.aÉtéCréé) return;

    return {
      référenceDossier: référenceDossier ?? this.référenceDossier,
      dateQualification: DateTime.convertirEnValueType(this.dateQualification),
    };
  }
}
