import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';
import type { LauréatWorld } from '../../lauréat.world.js';

interface TransmettreAttestationConformité {
  readonly attestation: PièceJustificative;
  readonly rapportAssocié: PièceJustificative;
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

  #rapportAssocié!: TransmettreAttestationConformité['rapportAssocié'];

  get rapportAssocié(): TransmettreAttestationConformité['rapportAssocié'] {
    return this.#rapportAssocié;
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
      rapportAssocié: faker.potentiel.document(),
      preuve: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#dateTransmissionAuCocontractant = fixture.dateTransmissionAuCocontractant;
    this.#date = fixture.date;
    this.#utilisateur = fixture.utilisateur;
    this.#attestation = fixture.attestation;
    this.#rapportAssocié = fixture.rapportAssocié;
    this.#preuve = fixture.preuve;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    return {
      dateAchèvementRéel: DateTime.convertirEnValueType(this.dateTransmissionAuCocontractant),
      attestation: Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        enregistréLe: DateTime.convertirEnValueType(this.date).formatter(),
        attestation: {
          format: this.attestation.format,
        },
      }),
      rapportAssocié: Lauréat.Achèvement.DocumentAchèvement.rapportAssocié({
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        enregistréLe: DateTime.convertirEnValueType(this.date).formatter(),
        rapportAssocie: {
          format: this.rapportAssocié.format,
        },
      }),
      preuveTransmissionAuCocontractant:
        Lauréat.Achèvement.DocumentAchèvement.preuveTransmissionAttestationConformité({
          identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
          dateTransmissionAuCocontractant: DateTime.convertirEnValueType(
            this.dateTransmissionAuCocontractant,
          ).formatter(),
          preuveTransmissionAuCocontractant: this.preuve,
        }),
      misÀJourLe: DateTime.convertirEnValueType(this.date),
      misÀJourPar: Email.convertirEnValueType(this.utilisateur),
    };
  }
}
