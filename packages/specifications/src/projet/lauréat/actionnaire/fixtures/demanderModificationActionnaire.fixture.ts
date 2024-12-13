import { faker } from '@faker-js/faker';

import { Actionnaire } from '@potentiel-domain/laureat';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';
import { AbstractFixture } from '../../../../fixture';

interface DemanderModificationActionnaire {
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
  readonly actionnaire: string;
}

export class DemanderModificationActionnaireFixture
  extends AbstractFixture<DemanderModificationActionnaire>
  implements DemanderModificationActionnaire
{
  #format!: string;
  #content!: string;

  get pièceJustificative(): DemanderModificationActionnaire['pièceJustificative'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #demandéLe!: string;

  get demandéLe(): string {
    return this.#demandéLe;
  }

  #demandéPar!: string;

  get demandéPar(): string {
    return this.#demandéPar;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  #actionnaire!: string;

  get actionnaire(): string {
    return this.#actionnaire;
  }

  créer(
    partialData?: Partial<DemanderModificationActionnaire>,
  ): Readonly<DemanderModificationActionnaire> {
    const content = faker.word.words();

    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.company.catchPhrase(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      actionnaire: faker.company.name(),
      ...partialData,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#actionnaire = fixture.actionnaire;

    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Actionnaire.ConsulterModificationActionnaireReadModel {
    return {
      identifiantProjet,
      statut: Actionnaire.StatutModificationActionnaire.demandé,
      demande: {
        demandéLe: DateTime.convertirEnValueType(this.#demandéLe),
        demandéPar: Email.convertirEnValueType(this.#demandéPar),
        raison: this.#raison,
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
          DateTime.convertirEnValueType(this.#demandéLe).formatter(),
          this.#format,
        ),
      },
    };
  }
}
