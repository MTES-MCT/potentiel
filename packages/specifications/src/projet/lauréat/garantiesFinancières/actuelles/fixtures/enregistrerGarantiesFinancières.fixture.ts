import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../../fixture.js';
import { GarantiesFinancièresActuellesWorld } from '../garantiesFinancièresActuelles.world.js';

export type EnregistrerGarantiesFinancières = {
  readonly type: string;
  readonly dateÉchéance: string | undefined;
  readonly dateConstitution: string;
  readonly attestation: PièceJustificative;
  readonly enregistréLe: string;
  readonly enregistréPar: string;
};

export type EnregistrerGarantiesFinancièresProps = Partial<EnregistrerGarantiesFinancières>;

export class EnregistrerGarantiesFinancièresFixture extends AbstractFixture<EnregistrerGarantiesFinancières> {
  #type!: EnregistrerGarantiesFinancières['type'];
  get type() {
    return this.#type;
  }

  #dateÉchéance!: EnregistrerGarantiesFinancières['dateÉchéance'];
  get dateÉchéance() {
    return this.#dateÉchéance;
  }

  #dateConstitution!: string;
  get dateConstitution() {
    return this.#dateConstitution;
  }

  #enregistréLe!: string;
  get enregistréLe() {
    return this.#enregistréLe;
  }

  #enregistréPar!: string;
  get enregistréPar() {
    return this.#enregistréPar;
  }

  #attestation!: EnregistrerGarantiesFinancières['attestation'];

  get attestation(): EnregistrerGarantiesFinancières['attestation'] {
    return this.#attestation;
  }

  constructor(
    public readonly garantiesFinancièresActuellesWorld: GarantiesFinancièresActuellesWorld,
  ) {
    super();
  }

  créer(
    partialData?: EnregistrerGarantiesFinancièresProps,
  ): Readonly<EnregistrerGarantiesFinancières> {
    const type =
      partialData?.type ??
      faker.helpers.arrayElement([
        'consignation',
        'avec-date-échéance',
        'six-mois-après-achèvement',
      ]);

    const fixture: EnregistrerGarantiesFinancières = {
      dateConstitution: faker.date.recent().toISOString(),
      enregistréLe: new Date().toISOString(),
      enregistréPar: faker.internet.email(),
      dateÉchéance: type === 'avec-date-échéance' ? faker.date.future().toISOString() : undefined,
      type,
      attestation: faker.potentiel.document(),
      ...partialData,
    };
    this.#attestation = fixture.attestation;
    this.#type = fixture.type;
    this.#dateConstitution = fixture.dateConstitution;
    this.#dateÉchéance = fixture.dateÉchéance;
    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected(): Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel {
    return {
      identifiantProjet:
        this.garantiesFinancièresActuellesWorld.garantiesFinancièresWorld.lauréatWorld
          .identifiantProjet,
      statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé,
      garantiesFinancières: Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
        type: this.#type,
        dateÉchéance: this.#dateÉchéance,
        constitution: {
          attestation: this.attestation,
          date: this.#dateConstitution,
        },
      }),
      document: Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationActuelle({
        identifiantProjet:
          this.garantiesFinancièresActuellesWorld.garantiesFinancièresWorld.lauréatWorld.identifiantProjet.formatter(),
        dateConstitution: this.#dateConstitution,
        attestation: { format: this.attestation.format },
      }),
      dernièreMiseÀJour: {
        date: DateTime.convertirEnValueType(this.enregistréLe),
        par: Email.convertirEnValueType(this.enregistréPar),
      },
      validéLe: DateTime.convertirEnValueType(this.#enregistréLe),
      dateLimiteSoumission: undefined,
      motifEnAttente: undefined,
    };
  }
}
