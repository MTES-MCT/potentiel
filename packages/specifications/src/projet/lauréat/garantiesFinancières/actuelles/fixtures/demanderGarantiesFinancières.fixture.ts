import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture, DeepPartial } from '../../../../../fixture.js';
import { GarantiesFinancièresActuellesWorld } from '../garantiesFinancièresActuelles.world.js';

export interface DemanderGarantiesFinancières {
  readonly motif: string;
  readonly dateLimiteSoumission: string;
  readonly demandéLe: string;
}

export type DemanderGarantiesFinancièresProps = DeepPartial<DemanderGarantiesFinancières>;

export class DemanderGarantiesFinancièresFixture extends AbstractFixture<DemanderGarantiesFinancières> {
  #motif!: string;
  get motif() {
    return this.#motif;
  }

  #dateLimiteSoumission!: string;
  get dateLimiteSoumission() {
    return this.#dateLimiteSoumission;
  }
  #demandéLe!: string;
  get demandéLe() {
    return this.#demandéLe;
  }

  constructor(
    public readonly garantiesFinancièresActuellesWorld: GarantiesFinancièresActuellesWorld,
  ) {
    super();
  }

  créer(partialData?: DemanderGarantiesFinancièresProps): Readonly<DemanderGarantiesFinancières> {
    const fixture: DemanderGarantiesFinancières = {
      motif: faker.helpers.arrayElement(
        Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.motifs,
      ),
      dateLimiteSoumission: faker.date.future().toISOString(),
      demandéLe: new Date().toISOString(),
      ...partialData,
    };
    this.#motif = fixture.motif;
    this.#dateLimiteSoumission = fixture.dateLimiteSoumission;
    this.#demandéLe = fixture.demandéLe;

    this.aÉtéCréé = true;

    return fixture;
  }
}
