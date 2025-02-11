import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../../fixture';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

interface TransmettreOuModifierAttestationConformitéDocument {
  readonly content: ReadableStream;
  readonly format: string;
}

interface TransmettreOuModifierAttestationConformité {
  readonly document: TransmettreOuModifierAttestationConformitéDocument;
  readonly dateTransmissionAuCocontractant: string;
  readonly date: string;
  readonly utilisateur: string;
}

export class TransmettreOuModifierAttestationConformitéFixture
  extends AbstractFixture<TransmettreOuModifierAttestationConformité>
  implements TransmettreOuModifierAttestationConformité
{
  #format!: string;
  #content!: string;

  get document(): TransmettreOuModifierAttestationConformité['document'] {
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
    partialFixture?: Partial<TransmettreOuModifierAttestationConformité>,
  ): TransmettreOuModifierAttestationConformité {
    const content = faker.word.words();
    const format = 'application/pdf';

    const fixture: TransmettreOuModifierAttestationConformité = {
      dateTransmissionAuCocontractant: faker.date.past().toISOString(),
      date: faker.date.soon().toISOString(),
      utilisateur: faker.internet.email(),
      document: {
        format,
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#dateTransmissionAuCocontractant = fixture.dateTransmissionAuCocontractant;
    this.#date = fixture.date;
    this.#utilisateur = fixture.utilisateur;
    this.#format = format;
    this.#content = content;

    this.aÉtéCréé = true;

    return fixture;
  }
}
