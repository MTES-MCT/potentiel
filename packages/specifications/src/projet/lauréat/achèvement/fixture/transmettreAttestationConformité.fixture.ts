import { faker } from '@faker-js/faker';

import { DocumentProjet, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../../fixture';
import { LauréatWorld } from '../../lauréat.world';

interface TransmettreAttestationConformitéDocument {
  readonly content: string;
  readonly format: string;
}

interface TransmettreAttestationConformité {
  readonly attestation: TransmettreAttestationConformitéDocument;
  readonly preuve: TransmettreAttestationConformitéDocument;
  readonly dateTransmissionAuCocontractant: string;
  readonly date: string;
  readonly utilisateur: string;
}

export class TransmettreAttestationConformitéFixture
  extends AbstractFixture<TransmettreAttestationConformité>
  implements TransmettreAttestationConformité
{
  #formatAttestation!: string;
  #contentAttestation!: string;

  get attestation(): TransmettreAttestationConformité['attestation'] {
    return {
      format: this.#formatAttestation,
      content: this.#contentAttestation,
    };
  }

  #formatPreuve!: string;
  #contentPreuve!: string;

  get preuve(): TransmettreAttestationConformité['preuve'] {
    return {
      format: this.#formatPreuve,
      content: this.#contentPreuve,
    };
  }

  #dateTransmissionAuCocontractant!: string;

  get dateTransmissionAuCocontractant(): string {
    return this.#dateTransmissionAuCocontractant;
  }

  #date!: string;

  get date(): string {
    return this.#date;
  }

  #utilisateur!: string;

  get utilisateur(): string {
    return this.#utilisateur;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(
    partialFixture?: Partial<TransmettreAttestationConformité>,
  ): TransmettreAttestationConformité {
    const contentAttestation = faker.word.words();
    const formatAttestation = 'application/pdf';

    const contentPreuve = faker.word.words();
    const formatPreuve = 'application/pdf';

    const fixture: TransmettreAttestationConformité = {
      dateTransmissionAuCocontractant: faker.date
        .between({
          from: new Date(
            new Date(this.lauréatWorld.notifierLauréatFixture.notifiéLe).getTime() + 1,
          ),
          to: new Date(),
        })
        .toISOString(),
      date: faker.date.soon().toISOString(),
      utilisateur: faker.internet.email(),
      attestation: {
        format: formatAttestation,
        content: contentAttestation,
      },
      preuve: {
        format: formatPreuve,
        content: contentPreuve,
      },
      ...partialFixture,
    };

    this.#dateTransmissionAuCocontractant = fixture.dateTransmissionAuCocontractant;
    this.#date = fixture.date;
    this.#utilisateur = fixture.utilisateur;
    this.#formatAttestation = formatAttestation;
    this.#contentAttestation = contentAttestation;
    this.#formatPreuve = formatPreuve;
    this.#contentPreuve = contentPreuve;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    return {
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
        DateTime.convertirEnValueType(this.date).formatter(),
        this.#formatAttestation,
      ),

      dateAchèvementRéel: DateTime.convertirEnValueType(this.dateTransmissionAuCocontractant),
      preuveTransmissionAuCocontractant: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
        DateTime.convertirEnValueType(this.dateTransmissionAuCocontractant).formatter(),
        this.#formatPreuve,
      ),
      misÀJourLe: DateTime.convertirEnValueType(this.date),
      misÀJourPar: Email.convertirEnValueType(this.utilisateur),
    };
  }
}
