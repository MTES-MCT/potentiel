import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';
import { type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../../fixture.js';

interface AccorderMainlevée {
  readonly accordéLe: string;
  readonly accordéPar: string;
  readonly motif: string;
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

  #motif!: string;
  get motif(): string {
    return this.#motif;
  }

  #courrierAccord!: AccorderMainlevée['courrierAccord'];

  get courrierAccord(): AccorderMainlevée['courrierAccord'] {
    return this.#courrierAccord;
  }

  créer(partialData?: Partial<Readonly<AccorderMainlevée>>): Readonly<AccorderMainlevée> {
    const fixture: AccorderMainlevée = {
      accordéLe: faker.date.soon().toISOString(),
      accordéPar: faker.internet.email(),
      motif: 'accordé-avec-l-abandon',
      courrierAccord: faker.potentiel.document(),
      ...partialData,
    };

    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéPar;
    this.#motif = fixture.motif;
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
        courrierAccord: Lauréat.GarantiesFinancières.DocumentMainlevée.accordée({
          identifiantProjet: identifiantProjet.formatter(),
          accordéLe: accordéeLe.formatter(),
          courrierAccord: { format: this.#courrierAccord.format },
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
