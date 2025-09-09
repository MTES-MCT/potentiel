import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture, DeepPartial } from '../../../../../fixture';

interface DemanderMainlevée {
  motif: string;
  demandéPar: string;
  demandéLe: string;
}

export type CréerDemanderMainlevéeFixtureProps = DeepPartial<Readonly<DemanderMainlevée>>;

export class DemanderMainlevéeFixture extends AbstractFixture<DemanderMainlevée> {
  #motif!: string;
  #demandéPar!: string;
  #demandéLe!: string;

  get motif() {
    return this.#motif;
  }
  get demandéPar() {
    return this.#demandéPar;
  }
  get demandéLe() {
    return this.#demandéLe;
  }

  créer(data: CréerDemanderMainlevéeFixtureProps): Readonly<DemanderMainlevée> {
    const fixture: DemanderMainlevée = {
      motif: faker.helpers.arrayElement(
        Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.motifs,
      ),
      demandéPar: faker.internet.email(),
      demandéLe: faker.date.past().toISOString(),
      ...data,
    };
    this.#demandéLe = fixture.demandéLe;
    this.#motif = fixture.motif;
    this.#demandéPar = fixture.demandéPar;
    this.aÉtéCréé = true;
    return fixture;
  }
}
