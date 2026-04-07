import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../fixture.js';

export type TransmettreDemandeComplèteRaccordement = {
  dateQualification: string;
  référenceDossier: string;
  accuséRéception: PièceJustificative;
};

export class TransmettreDemandeComplèteRaccordementFixture
  extends AbstractFixture<TransmettreDemandeComplèteRaccordement>
  implements TransmettreDemandeComplèteRaccordement
{
  #dateQualification!: string;
  get dateQualification(): string {
    return this.#dateQualification;
  }

  #référenceDossier!: string;
  get référenceDossier(): string {
    return this.#référenceDossier;
  }

  #accuséRéception!: PièceJustificative;
  get accuséRéception(): PièceJustificative {
    return this.#accuséRéception;
  }

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  créer(
    partialFixture: Partial<Readonly<TransmettreDemandeComplèteRaccordement>> & {
      identifiantProjet: string;
    },
  ): Readonly<TransmettreDemandeComplèteRaccordement> {
    const fixture = {
      dateQualification: faker.date.recent().toISOString(),
      référenceDossier: faker.commerce.isbn(),
      accuséRéception: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#dateQualification = fixture.dateQualification;
    this.#référenceDossier = fixture.référenceDossier;
    this.#accuséRéception = fixture.accuséRéception;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected(référenceDossier?: string) {
    if (!this.aÉtéCréé) return;

    return {
      accuséRéception: Lauréat.Raccordement.DocumentRaccordement.accuséRéception({
        identifiantProjet: this.identifiantProjet,
        référenceDossierRaccordement: référenceDossier ?? this.référenceDossier,
        dateQualification: this.#dateQualification,
        accuséRéception: this.accuséRéception,
      }),
      dateQualification: DateTime.convertirEnValueType(this.dateQualification),
    };
  }
}
