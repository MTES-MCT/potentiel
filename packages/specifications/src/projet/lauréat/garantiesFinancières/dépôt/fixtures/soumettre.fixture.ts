import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { AbstractFixture, DeepPartial } from '../../../../../fixture';
import { DépôtGarantiesFinancièresWorld } from '../dépôtGarantiesFinancières.world';

export interface SoumettreDépôtGarantiesFinancières {
  readonly type: string;
  readonly dateConstitution: string;
  readonly dateÉchéance: string | undefined;
  readonly dateDélibération: string | undefined;
  readonly soumisLe: string;
  readonly soumisPar: string;
  readonly attestation: { format: string; content: string };
}

export type SoumettreDépôtGarantiesFinancièresProps =
  DeepPartial<SoumettreDépôtGarantiesFinancières>;

export class SoumettreDépôtGarantiesFinancièresFixture extends AbstractFixture<SoumettreDépôtGarantiesFinancières> {
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
  #dateDélibération?: string;
  get dateDélibération() {
    return this.#dateDélibération;
  }
  #soumisLe!: string;
  get soumisLe() {
    return this.#soumisLe;
  }
  #soumisPar!: string;
  get soumisPar() {
    return this.#soumisPar;
  }

  #format!: string;
  #content!: string;

  get attestation(): SoumettreDépôtGarantiesFinancières['attestation'] {
    return {
      format: this.#format,
      content: this.#content,
    };
  }

  constructor(public dépôtGarantiesFinancièresWorld: DépôtGarantiesFinancièresWorld) {
    super();
  }

  créer(
    partialData?: SoumettreDépôtGarantiesFinancièresProps,
  ): Readonly<SoumettreDépôtGarantiesFinancières> {
    const type =
      partialData?.type ??
      faker.helpers.arrayElement([
        'consignation',
        'avec-date-échéance',
        'six-mois-après-achèvement',
      ]);

    const fixture: SoumettreDépôtGarantiesFinancières = {
      type,
      dateÉchéance: type === 'avec-date-échéance' ? faker.date.future().toISOString() : undefined,
      dateDélibération: type === 'exemption' ? faker.date.past().toISOString() : undefined,
      soumisLe: new Date().toISOString(),
      soumisPar: faker.internet.email(),
      dateConstitution: faker.date.recent().toISOString(),
      ...partialData,
      attestation: faker.potentiel.document(),
    };
    this.#type = fixture.type;
    this.#dateConstitution = fixture.dateConstitution;
    this.#dateÉchéance = fixture.dateÉchéance;
    this.#dateDélibération = fixture.dateDélibération;
    this.#soumisLe = fixture.soumisLe;
    this.#soumisPar = fixture.soumisPar;
    this.#content = fixture.attestation.content;
    this.#format = fixture.attestation.format;

    this.aÉtéCréé = true;
    return fixture;
  }
  mapToExpected():
    | Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel['dépôt']
    | undefined {
    if (!this.aÉtéCréé) return undefined;
    const gf = Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
      type: this.type,
      dateÉchéance: this.dateÉchéance,
    });
    return {
      type: gf.type,
      dateÉchéance: gf.estAvecDateÉchéance() ? gf.dateÉchéance : undefined,
      dateConstitution: DateTime.convertirEnValueType(this.dateConstitution),
      soumisLe: DateTime.convertirEnValueType(this.soumisLe),
      attestation: DocumentProjet.convertirEnValueType(
        this.dépôtGarantiesFinancièresWorld.garantiesFinancièresWorld.lauréatWorld.identifiantProjet.formatter(),
        Lauréat.GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
        this.dateConstitution,
        this.attestation.format,
      ),
      dernièreMiseÀJour: {
        date: DateTime.convertirEnValueType(this.soumisLe),
        par: Email.convertirEnValueType(this.soumisPar),
      },
    };
  }
}
