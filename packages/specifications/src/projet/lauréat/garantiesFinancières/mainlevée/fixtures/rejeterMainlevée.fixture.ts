import { faker } from '@faker-js/faker';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { AbstractFixture } from '../../../../../fixture';

interface RejeterMainlevée {
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
  readonly courrierRejet: { format: string; content: string };
}

export class RejeterMainlevéeFixture
  extends AbstractFixture<RejeterMainlevée>
  implements RejeterMainlevée
{
  #rejetéeLe!: string;
  get rejetéeLe(): string {
    return this.#rejetéeLe;
  }

  #rejetéePar!: string;
  get rejetéePar(): string {
    return this.#rejetéePar;
  }

  #format!: string;
  #content!: string;
  get courrierRejet() {
    return { format: this.#format, content: this.#content };
  }

  créer(partialData?: Partial<Readonly<RejeterMainlevée>>): Readonly<RejeterMainlevée> {
    const fixture: RejeterMainlevée = {
      rejetéeLe: faker.date.soon().toISOString(),
      rejetéePar: faker.internet.email(),
      courrierRejet: faker.potentiel.document(),
      ...partialData,
    };

    this.#rejetéeLe = fixture.rejetéeLe;
    this.#rejetéePar = fixture.rejetéePar;
    this.#format = fixture.courrierRejet.format;
    this.#content = fixture.courrierRejet.content;
    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    if (!this.aÉtéCréé) {
      return {};
    }
    const rejetéLe = DateTime.convertirEnValueType(this.rejetéeLe);
    const rejetéPar = Email.convertirEnValueType(this.rejetéePar);
    return {
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté,
      rejet: {
        rejetéLe,
        rejetéPar,
        courrierRejet: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.GarantiesFinancières.TypeDocumentRéponseMainlevée.courrierRéponseMainlevéeRejetéeValueType.formatter(),
          rejetéLe.formatter(),
          this.#format,
        ),
      },
      dernièreMiseÀJour: {
        date: rejetéLe,
        par: rejetéPar,
      },
    };
  }
}
