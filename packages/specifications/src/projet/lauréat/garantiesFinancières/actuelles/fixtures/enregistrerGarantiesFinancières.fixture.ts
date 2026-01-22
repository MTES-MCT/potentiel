import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/projet';

import { AbstractFixture, DeepPartial } from '../../../../../fixture.js';
import { GarantiesFinancièresActuellesWorld } from '../garantiesFinancièresActuelles.world.js';

export interface EnregistrerGarantiesFinancières {
  readonly type: string;
  readonly dateÉchéance: string | undefined;
  readonly dateConstitution: string;
  readonly attestation: { format: string; content: string };
  readonly enregistréLe: string;
  readonly enregistréPar: string;
}

export type EnregistrerGarantiesFinancièresProps = DeepPartial<EnregistrerGarantiesFinancières>;

export class EnregistrerGarantiesFinancièresFixture extends AbstractFixture<EnregistrerGarantiesFinancières> {
  #garantiesFinancièresType!: EnregistrerGarantiesFinancières['type'];
  get garantiesFinancièresType() {
    return this.#garantiesFinancièresType;
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

  #format!: string;
  #content!: string;

  get attestation(): EnregistrerGarantiesFinancières['attestation'] {
    return {
      format: this.#format,
      content: this.#content,
    };
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
      ...partialData,
      attestation: faker.potentiel.document(),
    };
    this.#content = fixture.attestation.content;
    this.#format = fixture.attestation.format;
    this.#garantiesFinancièresType = fixture.type;
    this.#dateConstitution = fixture.dateConstitution;
    this.#dateÉchéance = fixture.dateÉchéance;
    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    const gf = Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
      type: this.#garantiesFinancièresType,
      dateÉchéance: this.#dateÉchéance,
      attestation: this.attestation,
      dateConstitution: this.#dateConstitution,
    });
    const readModel: Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel = {
      identifiantProjet:
        this.garantiesFinancièresActuellesWorld.garantiesFinancièresWorld.lauréatWorld
          .identifiantProjet,
      statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé,
      garantiesFinancières: gf,
      document: DocumentProjet.convertirEnValueType(
        this.garantiesFinancièresActuellesWorld.garantiesFinancièresWorld.lauréatWorld.identifiantProjet.formatter(),
        Lauréat.GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
        this.dateConstitution,
        this.attestation.format,
      ),
      dernièreMiseÀJour: {
        date: DateTime.convertirEnValueType(this.enregistréLe),
        par: Email.convertirEnValueType(this.enregistréPar),
      },
    };
    return readModel;
  }
}
