import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../fixture.js';

export type PièceJustificative = { format: string; content: string };

interface TransmettreDemandeComplèteRaccordement {
  dateQualification: string;
  référenceDossier: string;
  accuséRéception?: PièceJustificative;
}

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

  #accuséRéception?: PièceJustificative;
  get accuséRéception(): PièceJustificative | undefined {
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
      attestation: {
        format: 'application/pdf',
        content: faker.word.words(),
      },
      ...partialFixture,
    };

    this.#dateQualification = fixture.dateQualification;
    this.#référenceDossier = fixture.référenceDossier;
    this.#accuséRéception = fixture.accuséRéception;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.aÉtéCréé = true;

    return fixture;
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    const values: Partial<TransmettreDemandeComplèteRaccordement> = {};
    const dateQualification = exemple['La date de qualification'];
    const référenceDossier = exemple['La référence du dossier de raccordement'];
    if (dateQualification) {
      values.dateQualification = new Date(dateQualification).toISOString();
    }
    if (référenceDossier) {
      values.référenceDossier = référenceDossier;
    }
    return values;
  }

  mapToExpected(référenceDossier?: string) {
    if (!this.aÉtéCréé) return;

    return {
      accuséRéception: Lauréat.Raccordement.DocumentRaccordement.accuséRéception({
        identifiantProjet: this.identifiantProjet,
        référence: référenceDossier ?? this.référenceDossier,
        dateQualification: this.#dateQualification,
        accuséRéception: this.accuséRéception,
      }),
      dateQualification: DateTime.convertirEnValueType(this.dateQualification),
    };
  }
}
