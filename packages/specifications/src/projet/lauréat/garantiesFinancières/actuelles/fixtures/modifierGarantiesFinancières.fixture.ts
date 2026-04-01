import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../../fixture.js';
import { GarantiesFinancièresActuellesWorld } from '../garantiesFinancièresActuelles.world.js';

export type ModifierGarantiesFinancières = {
  type: string;
  dateÉchéance: string | undefined;
  dateConstitution: string;
  attestation: PièceJustificative;
  enregistréLe: string;
  enregistréPar: string;
  estUnNouveauDocument: boolean;
};

export type ModifierGarantiesFinancièresProps = Partial<ModifierGarantiesFinancières>;

export class ModifierGarantiesFinancièresFixture extends AbstractFixture<ModifierGarantiesFinancières> {
  #type!: ModifierGarantiesFinancières['type'];
  get type() {
    return this.#type;
  }

  #dateÉchéance!: ModifierGarantiesFinancières['dateÉchéance'];
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

  #estUnNouveauDocument!: boolean;
  get estUnNouveauDocument(): boolean {
    return this.#estUnNouveauDocument;
  }

  #attestation!: PièceJustificative;

  get attestation(): PièceJustificative {
    return this.#attestation;
  }

  constructor(
    public readonly garantiesFinancièresActuellesWorld: GarantiesFinancièresActuellesWorld,
  ) {
    super();
  }

  créer(partialData?: ModifierGarantiesFinancièresProps): Readonly<ModifierGarantiesFinancières> {
    const type =
      partialData?.type ??
      faker.helpers.arrayElement([
        'consignation',
        'avec-date-échéance',
        'six-mois-après-achèvement',
      ]);

    const fixture: ModifierGarantiesFinancières = {
      dateConstitution: faker.date.recent().toISOString(),
      enregistréLe: new Date().toISOString(),
      enregistréPar: faker.internet.email(),
      dateÉchéance: type === 'avec-date-échéance' ? faker.date.future().toISOString() : undefined,
      type,
      attestation: faker.potentiel.document(),
      estUnNouveauDocument: true,
      ...partialData,
    };

    this.#type = fixture.type;
    this.#attestation = fixture.attestation;
    this.#dateConstitution = fixture.dateConstitution;
    this.#dateÉchéance = fixture.dateÉchéance;
    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;
    this.#estUnNouveauDocument = fixture.estUnNouveauDocument;

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
