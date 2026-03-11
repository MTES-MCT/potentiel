import { faker } from '@faker-js/faker';

import { DocumentProjet, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { AbstractFixture } from '../../../../fixture.js';
import { LauréatWorld } from '../../lauréat.world.js';

interface EnregistrerAttestationConformitéDocument {
  readonly content: string;
  readonly format: string;
}

interface EnregistrerAttestationConformité {
  readonly attestation: EnregistrerAttestationConformitéDocument;
  readonly enregistréeLe: string;
  readonly enregistréePar: string;
}

export class EnregistrerAttestationConformitéFixture
  extends AbstractFixture<EnregistrerAttestationConformité>
  implements EnregistrerAttestationConformité
{
  #attestation!: EnregistrerAttestationConformité['attestation'];

  get attestation(): EnregistrerAttestationConformité['attestation'] {
    return this.#attestation;
  }

  #enregistréeLe!: string;

  get enregistréeLe(): string {
    return this.#enregistréeLe;
  }

  #enregistréePar!: string;

  get enregistréePar(): string {
    return this.#enregistréePar;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(
    partialFixture?: Partial<EnregistrerAttestationConformité>,
  ): EnregistrerAttestationConformité {
    const fixture: EnregistrerAttestationConformité = {
      enregistréeLe: faker.date.soon().toISOString(),
      enregistréePar: faker.internet.email(),
      attestation: {
        format: 'application/pdf',
        content: faker.word.words(),
      },

      ...partialFixture,
    };

    this.#enregistréeLe = fixture.enregistréeLe;
    this.#enregistréePar = fixture.enregistréePar;
    this.#attestation = fixture.attestation;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    return {
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
        DateTime.convertirEnValueType(this.enregistréeLe).formatter(),
        this.attestation.format,
      ),

      preuveTransmissionAuCocontractant: Option.none,
      misÀJourLe: DateTime.convertirEnValueType(this.enregistréeLe),
      misÀJourPar: Email.convertirEnValueType(this.enregistréePar),
    };
  }
}
