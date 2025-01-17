import { faker } from '@faker-js/faker';

import { DocumentProjet } from '@potentiel-domain/document';
import { Raccordement } from '@potentiel-domain/reseau';
import { DateTime } from '@potentiel-domain/common';

import { AbstractFixture } from '../../fixture';
import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';

type PièceJustificative = { format: string; content: ReadableStream };

interface TransmettreDemandeComplèteRaccordement {
  dateQualification: string;
  référenceDossier: string;
  accuséRéception: PièceJustificative;
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
