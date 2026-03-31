import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../fixture.js';

export type ModifierDemandeComplèteRaccordement = {
  dateQualification: string;
  référenceDossier: string;
  accuséRéception: PièceJustificative;
  estUnNouveauDocument: boolean;
};

export class ModifierDemandeComplèteRaccordementFixture
  extends AbstractFixture<ModifierDemandeComplèteRaccordement>
  implements ModifierDemandeComplèteRaccordement
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

  #estUnNouveauDocument!: boolean;
  get estUnNouveauDocument(): boolean {
    return this.#estUnNouveauDocument;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierDemandeComplèteRaccordement>> & {
      identifiantProjet: string;
    },
  ): Readonly<ModifierDemandeComplèteRaccordement> {
    const fixture = {
      dateQualification: faker.date.recent().toISOString(),
      référenceDossier: faker.commerce.isbn(),
      accuséRéception: {
        format: faker.potentiel.fileFormat(),
        content: faker.word.words(),
      },
      estUnNouveauDocument: true,
      ...partialFixture,
    };

    this.#dateQualification = fixture.dateQualification;
    this.#référenceDossier = fixture.référenceDossier;
    this.#accuséRéception = fixture.accuséRéception;
    this.#estUnNouveauDocument = fixture.estUnNouveauDocument;

    this.#identifiantProjet = fixture.identifiantProjet;
    this.aÉtéCréé = true;
    return fixture;
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
