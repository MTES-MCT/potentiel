import { faker } from '@faker-js/faker';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { AbstractFixture } from '../../../../../fixture';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

interface AccorderMainlevée {
  readonly accordéLe: string;
  readonly accordéPar: string;
  readonly courrierAccord: { format: string; content: ReadableStream };
}

export class AccorderMainlevéeFixture
  extends AbstractFixture<AccorderMainlevée>
  implements AccorderMainlevée
{
  #accordéLe!: string;
  get accordéLe(): string {
    return this.#accordéLe;
  }

  #accordéPar!: string;
  get accordéPar(): string {
    return this.#accordéPar;
  }

  #format!: string;
  #content!: string;

  get courrierAccord(): AccorderMainlevée['courrierAccord'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  créer(partialData?: Partial<Readonly<AccorderMainlevée>>): Readonly<AccorderMainlevée> {
    const content = faker.word.words();
    const fixture: AccorderMainlevée = {
      accordéLe: faker.date.soon().toISOString(),
      accordéPar: faker.internet.email(),
      courrierAccord: {
        format: 'application/pdf',
        content: convertStringToReadableStream(content),
      },
      ...partialData,
    };

    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéPar;
    this.#format = fixture.courrierAccord.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    if (!this.aÉtéCréé) {
      return {};
    }
    const accordéeLe = DateTime.convertirEnValueType(this.accordéLe);
    const accordéePar = Email.convertirEnValueType(this.accordéPar);
    return {
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.accordé,
      accord: {
        accordéeLe,
        accordéePar,
        courrierAccord: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.GarantiesFinancières.TypeDocumentRéponseMainlevée.courrierRéponseMainlevéeAccordéeValueType.formatter(),
          accordéeLe.formatter(),
          this.#format,
        ),
      },
      dernièreMiseÀJour: {
        date: accordéeLe,
        par: accordéePar,
      },
    };
  }
}
