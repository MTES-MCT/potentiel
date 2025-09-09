import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { AbstractFixture, DeepPartial } from '../../../../../fixture';
import { GarantiesFinancièresActuellesWorld } from '../garantiesFinancièresActuelles.world';

export interface EnregistrerGarantiesFinancières {
  readonly garantiesFinancières: {
    type: string;
    dateÉchéance?: string;
    dateDélibération?: string;
  };
  readonly dateConstitution: string;
  readonly attestation: { format: string; content: string };
  readonly enregistréLe: string;
  readonly enregistréPar: string;
}

export type EnregistrerGarantiesFinancièresProps = DeepPartial<EnregistrerGarantiesFinancières>;

export class EnregistrerGarantiesFinancièresFixture extends AbstractFixture<EnregistrerGarantiesFinancières> {
  #garantiesFinancières!: EnregistrerGarantiesFinancières['garantiesFinancières'];
  get garantiesFinancières() {
    return this.#garantiesFinancières;
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
      partialData?.garantiesFinancières?.type ??
      faker.helpers.arrayElement([
        'consignation',
        'avec-date-échéance',
        'six-mois-après-achèvement',
      ]);

    const content = faker.word.words();
    const fixture: EnregistrerGarantiesFinancières = {
      dateConstitution: faker.date.recent().toISOString(),
      enregistréLe: new Date().toISOString(),
      enregistréPar: faker.internet.email(),
      ...partialData,
      attestation: {
        format: faker.potentiel.fileFormat(),
        content,
      },
      garantiesFinancières: {
        type,
        dateÉchéance: type === 'avec-date-échéance' ? faker.date.future().toISOString() : undefined,
        dateDélibération: type === 'exemption' ? faker.date.recent().toISOString() : undefined,
        ...partialData?.garantiesFinancières,
      },
    };
    this.#content = content;
    this.#format = fixture.attestation.format;
    this.#garantiesFinancières = fixture.garantiesFinancières;
    this.#dateConstitution = fixture.dateConstitution;
    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    const gf = Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType(
      this.garantiesFinancières,
    );
    const readModel: Lauréat.GarantiesFinancières.DétailsGarantiesFinancièresReadModel = {
      statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé,
      type: gf.type,
      dateÉchéance: gf.estAvecDateÉchéance() ? gf.dateÉchéance : undefined,
      dateConstitution: DateTime.convertirEnValueType(this.dateConstitution),
      attestation: DocumentProjet.convertirEnValueType(
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
