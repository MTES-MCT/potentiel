import { faker } from '@faker-js/faker';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../../fixture';

interface AccorderMainlevée {
  readonly accordéLe: string;
  readonly accordéPar: string;
  readonly courrierAccord: { format: string; content: string };
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
      content: this.#content,
    };
  }

  créer(partialData?: Partial<Readonly<AccorderMainlevée>>): Readonly<AccorderMainlevée> {
    const fixture: AccorderMainlevée = {
      accordéLe: faker.date.soon().toISOString(),
      accordéPar: faker.internet.email(),
      courrierAccord: faker.potentiel.document(),
      ...partialData,
    };

    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéPar;
    this.#format = fixture.courrierAccord.format;
    this.#content = fixture.courrierAccord.content;

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
