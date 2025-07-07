import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

interface TransmettreOuModifierAttestationConformitéDocument {
  readonly content: ReadableStream;
  readonly format: string;
}

interface TransmettreOuModifierAttestationConformité {
  readonly attestation: TransmettreOuModifierAttestationConformitéDocument;
  readonly preuve: TransmettreOuModifierAttestationConformitéDocument;
  readonly dateTransmissionAuCocontractant: string;
  readonly date: string;
  readonly utilisateur: string;
}

export class TransmettreOuModifierAttestationConformitéFixture
  extends AbstractFixture<TransmettreOuModifierAttestationConformité>
  implements TransmettreOuModifierAttestationConformité
{
  #formatAttestation!: string;
  #contentAttestation!: string;

  get attestation(): TransmettreOuModifierAttestationConformité['attestation'] {
    return {
      format: this.#formatAttestation,
      content: convertStringToReadableStream(this.#contentAttestation),
    };
  }

  #formatPreuve!: string;
  #contentPreuve!: string;

  get preuve(): TransmettreOuModifierAttestationConformité['preuve'] {
    return {
      format: this.#formatPreuve,
      content: convertStringToReadableStream(this.#contentPreuve),
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

  créer(
    partialFixture?: Partial<TransmettreOuModifierAttestationConformité>,
  ): TransmettreOuModifierAttestationConformité {
    const contentAttestation = faker.word.words();
    const formatAttestation = 'application/pdf';

    const contentPreuve = faker.word.words();
    const formatPreuve = 'application/pdf';

    const fixture: TransmettreOuModifierAttestationConformité = {
      dateTransmissionAuCocontractant: faker.date.past().toISOString(),
      date: faker.date.soon().toISOString(),
      utilisateur: faker.internet.email(),
      attestation: {
        format: formatAttestation,
        content: convertStringToReadableStream(contentAttestation),
      },
      preuve: {
        format: formatPreuve,
        content: convertStringToReadableStream(contentPreuve),
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
}
