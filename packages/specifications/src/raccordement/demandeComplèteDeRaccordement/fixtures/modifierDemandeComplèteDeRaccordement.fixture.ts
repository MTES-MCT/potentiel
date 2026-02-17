import { faker } from '@faker-js/faker';

import { DocumentProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../fixture.js';
import { convertStringToReadableStream } from '../../../helpers/convertStringToReadable.js';

type PièceJustificative = { format: string; content: ReadableStream };

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

  #format!: string | undefined;
  #content!: string | undefined;
  get accuséRéception(): ModifierDemandeComplèteRaccordement['accuséRéception'] {
    return this.#format && this.#content
      ? {
          format: this.#format,
          content: convertStringToReadableStream(this.#content),
        }
      : undefined;
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
    const content = faker.word.words();
    const fixture = {
      dateQualification: faker.date.recent().toISOString(),
      référenceDossier: faker.commerce.isbn(),
      accuséRéception: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#dateQualification = fixture.dateQualification;
    this.#référenceDossier = fixture.référenceDossier;
    this.#format = fixture.accuséRéception?.format;
    this.#content = partialFixture.accuséRéception ? content : undefined;
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
