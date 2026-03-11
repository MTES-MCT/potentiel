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
  #attestation?: ModifierAttestationConformité['attestation'];

  get attestation(): ModifierAttestationConformité['attestation'] {
    return this.#attestation;
  }

  #preuve?: ModifierAttestationConformité['preuve'];
  get preuve(): ModifierAttestationConformité['preuve'] {
    return this.#preuve;
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
    const fixture: ModifierAttestationConformité = {
      dateTransmissionAuCocontractant: faker.date
        .between({
          from: DateTime.convertirEnValueType(
            this.lauréatWorld.notifierLauréatFixture.notifiéLe,
          ).ajouterNombreDeJours(1).date,
          to: DateTime.now().date,
        })
        .toISOString(),
      attestation: {
        format: 'application/pdf',
        content: faker.word.words(),
      },
      preuve: {
        format: 'application/pdf',
        content: faker.word.words(),
      },
      date: faker.date.soon().toISOString(),
      utilisateur: faker.internet.email(),
      ...partialFixture,
    };

    this.#dateTransmissionAuCocontractant = fixture.dateTransmissionAuCocontractant;
    this.#date = fixture.date;
    this.#utilisateur = fixture.utilisateur;
    this.#attestation = fixture.attestation;
    this.#preuve = fixture.preuve;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    return {
      dateAchèvementRéel: DateTime.convertirEnValueType(this.dateTransmissionAuCocontractant),

      ...(this.attestation && {
        attestation: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
          DateTime.convertirEnValueType(this.date).formatter(),
          this.attestation.format,
        ),
      }),
      ...(this.preuve && {
        preuveTransmissionAuCocontractant: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
          DateTime.convertirEnValueType(this.dateTransmissionAuCocontractant).formatter(),
          this.preuve.format,
        ),
      }),
      misÀJourLe: DateTime.convertirEnValueType(this.date),
      misÀJourPar: Email.convertirEnValueType(this.utilisateur),
    };
  }
}
