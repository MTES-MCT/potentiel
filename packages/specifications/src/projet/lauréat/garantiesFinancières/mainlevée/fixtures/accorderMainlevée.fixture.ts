import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';
import { type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../../fixture.js';

interface AccorderMainlevée {
  readonly accordéLe: string;
  readonly accordéPar: string;
  readonly motif: string;
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

  #motif!: string;
  get motif(): string {
    return this.#motif;
  }

  créer(partialData?: Partial<Readonly<AccorderMainlevée>>): Readonly<AccorderMainlevée> {
    const fixture: AccorderMainlevée = {
      accordéLe: faker.date.soon().toISOString(),
      accordéPar: faker.internet.email(),
      motif: 'projet-abandonné',
      ...partialData,
    };

    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéPar;
    this.#motif = fixture.motif;

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
        }),
      },
      motif: Lauréat.GarantiesFinancières.MotifMainlevéeGarantiesFinancières.convertirEnValueType(
        this.motif,
      ),
      dernièreMiseÀJour: {
        date: accordéeLe,
        par: accordéePar,
      },
    };
  }
}
