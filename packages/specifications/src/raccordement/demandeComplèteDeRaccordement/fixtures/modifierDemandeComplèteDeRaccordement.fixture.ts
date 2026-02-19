import { faker } from '@faker-js/faker';

import { DocumentProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../fixture.js';

import { PièceJustificative } from './transmettreDemandeComplèteDeRaccordement.fixture.js';

export interface ModifierDemandeComplèteRaccordement {
  dateQualification: string;
  référenceDossier: string;
  accuséRéception?: PièceJustificative;
}

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

  #format!: string;
  #content!: string;

  get accuséRéception(): ModifierDemandeComplèteRaccordement['accuséRéception'] {
    return {
      format: this.#format,
      content: this.#content,
    };
  }

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
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
      ...partialFixture,
    };

    this.#dateQualification = fixture.dateQualification;
    this.#référenceDossier = fixture.référenceDossier;

    if (fixture.accuséRéception) {
      this.#format = fixture.accuséRéception.format;
      this.#content = fixture.accuséRéception.content;
    }

    this.#identifiantProjet = fixture.identifiantProjet;
    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected(référenceDossier?: string) {
    if (!this.aÉtéCréé) return;

    return {
      accuséRéception: this.accuséRéception
        ? DocumentProjet.convertirEnValueType(
            this.identifiantProjet,
            Lauréat.Raccordement.TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
              référenceDossier ?? this.référenceDossier,
            ).formatter(),
            this.#dateQualification,
            this.accuséRéception.format,
          )
        : undefined,
      dateQualification: DateTime.convertirEnValueType(this.dateQualification),
    };
  }
}
