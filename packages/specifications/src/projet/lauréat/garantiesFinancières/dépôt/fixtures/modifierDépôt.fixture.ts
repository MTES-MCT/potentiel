import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../../fixture.js';
import { DépôtGarantiesFinancièresWorld } from '../dépôtGarantiesFinancières.world.js';

export interface ModifierDépôtGarantiesFinancières {
  type: string;
  dateConstitution: string;
  dateÉchéance: string | undefined;
  modifiéLe: string;
  modifiéPar: string;
  attestation: PièceJustificative;
  estUnNouveauDocument: boolean;
}

export type ModifierDépôtGarantiesFinancièresProps = Partial<ModifierDépôtGarantiesFinancières>;

export class ModifierDépôtGarantiesFinancièresFixture extends AbstractFixture<ModifierDépôtGarantiesFinancières> {
  #type!: string;
  get type() {
    return this.#type;
  }

  #dateConstitution!: string;
  get dateConstitution() {
    return this.#dateConstitution;
  }

  #dateÉchéance?: string;
  get dateÉchéance() {
    return this.#dateÉchéance;
  }

  #modifiéLe!: string;
  get modifiéLe() {
    return this.#modifiéLe;
  }

  #modifiéPar!: string;
  get modifiéPar() {
    return this.#modifiéPar;
  }

  #estUnNouveauDocument!: boolean;
  get estUnNouveauDocument(): boolean {
    return this.#estUnNouveauDocument;
  }

  #attestation!: PièceJustificative;

  get attestation(): PièceJustificative {
    return this.#attestation;
  }

  constructor(public dépôtGarantiesFinancièresWorld: DépôtGarantiesFinancièresWorld) {
    super();
  }

  créer(
    partialData?: ModifierDépôtGarantiesFinancièresProps,
  ): Readonly<ModifierDépôtGarantiesFinancières> {
    const type =
      partialData?.type ??
      faker.helpers.arrayElement([
        'consignation',
        'avec-date-échéance',
        'six-mois-après-achèvement',
      ]);

    const fixture: ModifierDépôtGarantiesFinancières = {
      type,
      dateÉchéance: type === 'avec-date-échéance' ? faker.date.future().toISOString() : undefined,
      modifiéLe: new Date().toISOString(),
      modifiéPar: faker.internet.email(),
      dateConstitution: faker.date.recent().toISOString(),
      attestation: faker.potentiel.document(),
      estUnNouveauDocument: true,
      ...partialData,
    };

    this.#type = fixture.type;
    this.#dateConstitution = fixture.dateConstitution;
    this.#dateÉchéance = fixture.dateÉchéance;
    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;
    this.#estUnNouveauDocument = fixture.estUnNouveauDocument;
    this.#attestation = fixture.attestation;

    this.aÉtéCréé = true;
    return fixture;
  }

  mapToExpected():
    | Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel
    | undefined {
    if (!this.aÉtéCréé) return undefined;

    const garantiesFinancières =
      Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
        type: this.type,
        dateÉchéance: this.dateÉchéance,
        constitution: {
          attestation: this.attestation,
          date: this.dateConstitution,
        },
      });
    return {
      identifiantProjet:
        this.dépôtGarantiesFinancièresWorld.garantiesFinancièresWorld.lauréatWorld
          .identifiantProjet,
      garantiesFinancières,
      soumisLe: DateTime.convertirEnValueType(this.modifiéLe),
      document: Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationSoumise({
        identifiantProjet:
          this.dépôtGarantiesFinancièresWorld.garantiesFinancièresWorld.lauréatWorld.identifiantProjet.formatter(),
        dateConstitution: this.dateConstitution,
        attestation: { format: this.attestation.format },
      }),
      dernièreMiseÀJour: {
        date: DateTime.convertirEnValueType(this.modifiéLe),
        par: Email.convertirEnValueType(this.modifiéPar),
      },
    };
  }
}
