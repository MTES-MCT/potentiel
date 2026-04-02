import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';
import { LauréatWorld } from '../../lauréat.world.js';

interface TransmettreAttestationConformité {
  readonly attestation: PièceJustificative;
  readonly preuve: PièceJustificative;
  readonly dateTransmissionAuCocontractant: string;
  readonly date: string;
  readonly utilisateur: string;
}

export class TransmettreAttestationConformitéFixture
  extends AbstractFixture<TransmettreAttestationConformité>
  implements TransmettreAttestationConformité
{
  #attestation!: TransmettreAttestationConformité['attestation'];

  get attestation(): TransmettreAttestationConformité['attestation'] {
    return this.#attestation;
  }

  #preuve!: TransmettreAttestationConformité['preuve'];
  get preuve(): TransmettreAttestationConformité['preuve'] {
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

  créer(
    partialFixture?: Partial<TransmettreAttestationConformité>,
  ): TransmettreAttestationConformité {
    const fixture: TransmettreAttestationConformité = {
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
      attestation: faker.potentiel.document(),
      preuve: faker.potentiel.document(),
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

  mapToExpected() {
    return {
      attestation: Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        enregistréLe: DateTime.convertirEnValueType(this.date).formatter(),
        'attestation-conformite': {
          format: this.attestation.format,
        },
      }),

      dateAchèvementRéel: DateTime.convertirEnValueType(this.dateTransmissionAuCocontractant),
      preuveTransmissionAuCocontractant:
        Lauréat.Achèvement.DocumentAchèvement.preuveTransmissionAttestationConformité({
          identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
          enregistréLe: DateTime.convertirEnValueType(
            this.dateTransmissionAuCocontractant,
          ).formatter(),
          'preuve-transmission-attestation-conformite': {
            format: this.preuve.format,
          },
        }),
      misÀJourLe: DateTime.convertirEnValueType(this.date),
      misÀJourPar: Email.convertirEnValueType(this.utilisateur),
    };
  }
}
