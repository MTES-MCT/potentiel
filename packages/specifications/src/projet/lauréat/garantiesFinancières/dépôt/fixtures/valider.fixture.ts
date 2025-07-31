import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { AbstractFixture, DeepPartial } from '../../../../../fixture';
import { DépôtGarantiesFinancièresWorld } from '../dépôtGarantiesFinancières.world';

export interface ValiderDépôtGarantiesFinancières {
  validéLe: string;
  validéPar: string;
}

export type ValiderDépôtGarantiesFinancièresProps = DeepPartial<ValiderDépôtGarantiesFinancières>;

export class ValiderDépôtGarantiesFinancièresFixture extends AbstractFixture<ValiderDépôtGarantiesFinancières> {
  #validéLe!: string;
  get validéLe() {
    return this.#validéLe;
  }
  #validéPar!: string;
  get validéPar() {
    return this.#validéPar;
  }

  constructor(public dépôtGarantiesFinancièresWorld: DépôtGarantiesFinancièresWorld) {
    super();
  }

  créer(
    partialData?: ValiderDépôtGarantiesFinancièresProps,
  ): Readonly<ValiderDépôtGarantiesFinancières> {
    const fixture: ValiderDépôtGarantiesFinancières = {
      validéLe: new Date().toISOString(),
      validéPar: faker.internet.email(),
      ...partialData,
    };
    this.#validéLe = fixture.validéLe;
    this.#validéPar = fixture.validéPar;
    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected() {
    if (!this.aÉtéCréé) return {};
    return {
      validéLe: DateTime.convertirEnValueType(this.validéLe),
      statut: GarantiesFinancières.StatutGarantiesFinancières.validé,
      dernièreMiseÀJour: {
        date: DateTime.convertirEnValueType(this.validéLe),
        par: Email.convertirEnValueType(this.validéPar),
      },
    };
  }
}
