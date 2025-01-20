import { faker } from '@faker-js/faker';

import { DocumentProjet } from '@potentiel-domain/document';
import { Raccordement } from '@potentiel-domain/reseau';
import { DateTime } from '@potentiel-domain/common';

import { AbstractFixture } from '../../fixture';
import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';

type PièceJustificative = { format: string; content: ReadableStream };

interface ModifierDemandeComplèteRaccordement {
  dateQualification: string;
  référenceDossier: string;
  accuséRéception: PièceJustificative;
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
  get accuséRéception(): PièceJustificative {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
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
    this.#format = fixture.accuséRéception.format;
    this.#content = content;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected(référenceDossier?: string) {
    if (!this.aÉtéCréé) return;
    return {
      accuséRéception: DocumentProjet.convertirEnValueType(
        this.identifiantProjet,
        Raccordement.TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
          référenceDossier ?? this.référenceDossier,
        ).formatter(),
        this.#dateQualification,
        this.accuséRéception.format,
      ),
      dateQualification: DateTime.convertirEnValueType(this.dateQualification),
    };
  }
}
