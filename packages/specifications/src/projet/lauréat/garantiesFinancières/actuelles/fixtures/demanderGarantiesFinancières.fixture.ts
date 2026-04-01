import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture, DeepPartial } from '../../../../../fixture.js';
import { GarantiesFinancièresActuellesWorld } from '../garantiesFinancièresActuelles.world.js';

export interface DemanderGarantiesFinancières {
  readonly type: 'type-inconnu';
  readonly motif: string;
  readonly dateLimiteSoumission: string;
  readonly enregistréLe: string;
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

  #enregistréLe!: string;
  get enregistréLe() {
    return this.#enregistréLe;
  }

  #type!: 'type-inconnu';
  get type() {
    return this.#type;
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
      enregistréLe: new Date().toISOString(),
      ...partialData,

      type: 'type-inconnu',
    };
    this.#type = fixture.type;
    this.#motif = fixture.motif;
    this.#dateLimiteSoumission = fixture.dateLimiteSoumission;
    this.#enregistréLe = fixture.enregistréLe;

    this.aÉtéCréé = true;

    return fixture;
  }
}
