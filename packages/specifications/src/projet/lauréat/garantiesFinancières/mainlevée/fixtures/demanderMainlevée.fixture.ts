import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

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

  mapToExpected() {
    if (!this.aÉtéCréé) {
      throw new Error(`Le fixture n'a pas été créée`);
    }
    const demandéeLe = DateTime.convertirEnValueType(this.demandéLe);
    const demandéePar = Email.convertirEnValueType(this.demandéPar);
    return {
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.demandé,
      demande: {
        demandéeLe,
        demandéePar,
      },
      motif:
        Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
          this.motif,
        ),
      dernièreMiseÀJour: {
        date: demandéeLe,
        par: demandéePar,
      },
    };
  }
}
