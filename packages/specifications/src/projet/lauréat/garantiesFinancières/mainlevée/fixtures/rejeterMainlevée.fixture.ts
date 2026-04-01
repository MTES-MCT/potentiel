import { faker } from '@faker-js/faker';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../../fixture.js';

interface RejeterMainlevée {
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
  readonly courrierRejet: PièceJustificative;
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

  #courrierRejet!: RejeterMainlevée['courrierRejet'];
  get courrierRejet() {
    return this.#courrierRejet;
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
    this.#courrierRejet = fixture.courrierRejet;
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
        courrierRejet: Lauréat.GarantiesFinancières.DocumentMainlevée.demandeRejetée({
          identifiantProjet: identifiantProjet.formatter(),
          rejetéLe: rejetéLe.formatter(),
          reponseSignée: {
            format: this.#courrierRejet.format,
          },
        }),
      },
      dernièreMiseÀJour: {
        date: rejetéLe,
        par: rejetéPar,
      },
    };
  }
}
