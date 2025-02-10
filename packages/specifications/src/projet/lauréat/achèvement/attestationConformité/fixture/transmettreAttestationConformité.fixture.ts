import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../../fixture';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

interface TransmettreAttestationConformité {
  readonly attestation: {
    content: ReadableStream;
    format: string;
  };
  readonly dateTransmissionAuCocontractant: string;
  readonly preuveTransmissionAuCocontractant: {
    content: ReadableStream;
    format: string;
  };
  readonly date: string;
  readonly utilisateur: string;
}

export class TransmettreAttestationConformitéFixture
  extends AbstractFixture<TransmettreAttestationConformité>
  implements TransmettreAttestationConformité
{
  #format!: string;
  #content!: string;

  get attestation(): TransmettreAttestationConformité['attestation'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  get preuveTransmissionAuCocontractant(): TransmettreAttestationConformité['preuveTransmissionAuCocontractant'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
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
    partialFixture?: Partial<TransmettreAttestationConformité>,
  ): TransmettreAttestationConformité {
    const content = faker.word.words();

    const fixture: TransmettreAttestationConformité = {
      dateTransmissionAuCocontractant: faker.date.past().toISOString(),
      date: faker.date.soon().toISOString(),
      utilisateur: faker.internet.email(),
      preuveTransmissionAuCocontractant: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      attestation: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#dateTransmissionAuCocontractant = fixture.dateTransmissionAuCocontractant;
    this.#utilisateur = fixture.utilisateur;
    this.#format = fixture.attestation.format;
    this.#content = content;

    this.aÉtéCréé = true;

    return fixture;
  }
}
