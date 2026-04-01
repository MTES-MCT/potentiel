import { faker } from '@faker-js/faker';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../../fixture.js';

interface AccorderMainlevée {
  readonly accordéLe: string;
  readonly accordéPar: string;
  readonly courrierAccord: PièceJustificative;
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

  #courrierAccord!: AccorderMainlevée['courrierAccord'];

  get courrierAccord(): AccorderMainlevée['courrierAccord'] {
    return this.#courrierAccord;
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
    this.#courrierAccord = fixture.courrierAccord;

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
        courrierAccord: Lauréat.GarantiesFinancières.DocumentMainlevée.demandeAccordée({
          identifiantProjet: identifiantProjet.formatter(),
          accordéLe: accordéeLe.formatter(),
          reponseSignée: {
            format: this.#courrierAccord.format,
          },
        }),
      },
      dernièreMiseÀJour: {
        date: accordéeLe,
        par: accordéePar,
      },
    };
  }
}
