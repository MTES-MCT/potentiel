import { faker } from '@faker-js/faker';

import { DocumentProjet, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../../fixture.js';
import { LauréatWorld } from '../../lauréat.world.js';

interface ModifierAttestationConformitéDocument {
  readonly content: string;
  readonly format: string;
}

interface ModifierAttestationConformité {
  readonly attestation?: ModifierAttestationConformitéDocument;
  readonly preuve?: ModifierAttestationConformitéDocument;
  readonly dateTransmissionAuCocontractant: string;
  readonly date: string;
  readonly utilisateur: string;
}

export class ModifierAttestationConformitéFixture
  extends AbstractFixture<ModifierAttestationConformité>
  implements ModifierAttestationConformité
{
  #formatAttestation!: string;
  #contentAttestation!: string;

  get attestation(): ModifierAttestationConformité['attestation'] {
    return {
      format: this.#formatAttestation,
      content: this.#contentAttestation,
    };
  }

  #formatPreuve: string | undefined;
  #contentPreuve: string | undefined;

  get preuve(): ModifierAttestationConformité['preuve'] {
    return this.#formatPreuve && this.#contentPreuve
      ? {
          format: this.#formatPreuve,
          content: this.#contentPreuve,
        }
      : undefined;
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

  créer(partialFixture?: Partial<ModifierAttestationConformité>): ModifierAttestationConformité {
    const contentAttestation = faker.word.words();
    const formatAttestation = 'application/pdf';

    const contentPreuve = faker.word.words();
    const formatPreuve = 'application/pdf';

    const fixture: ModifierAttestationConformité = {
      dateTransmissionAuCocontractant: faker.date
        .between({
          from: DateTime.convertirEnValueType(
            this.lauréatWorld.notifierLauréatFixture.notifiéLe,
          ).ajouterNombreDeJours(1).date,
          to: DateTime.now().date,
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
    this.#formatPreuve = fixture.preuve?.format;
    this.#contentPreuve = fixture.preuve?.content;

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
      ...(this.#formatPreuve && {
        preuveTransmissionAuCocontractant: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
          DateTime.convertirEnValueType(this.dateTransmissionAuCocontractant).formatter(),
          this.#formatPreuve,
        ),
      }),
      misÀJourLe: DateTime.convertirEnValueType(this.date),
      misÀJourPar: Email.convertirEnValueType(this.utilisateur),
    };
  }
}
