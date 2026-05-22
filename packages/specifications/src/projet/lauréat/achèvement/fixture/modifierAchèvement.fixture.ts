import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';
import type { LauréatWorld } from '../../lauréat.world.js';

interface ModifierAchèvement {
  readonly date: string;
  readonly dateTransmissionAuCocontractant: string;
  readonly utilisateur: string;
  readonly raison: string;
  readonly attestation?: PièceJustificative;
  readonly rapportAssocié?: PièceJustificative;
  readonly preuve?: PièceJustificative;
}

export class ModifierAchèvementFixture
  extends AbstractFixture<ModifierAchèvement>
  implements ModifierAchèvement
{
  #attestation?: ModifierAchèvement['attestation'];

  get attestation(): ModifierAchèvement['attestation'] {
    return this.#attestation;
  }

  #rapportAssocié?: ModifierAchèvement['attestation'];

  get rapportAssocié(): ModifierAchèvement['rapportAssocié'] {
    return this.#rapportAssocié;
  }

  #preuve?: ModifierAchèvement['preuve'];
  get preuve(): ModifierAchèvement['preuve'] {
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

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(partialFixture?: Partial<ModifierAchèvement>): ModifierAchèvement {
    const fixture: ModifierAchèvement = {
      date: faker.date.soon().toISOString(),
      dateTransmissionAuCocontractant: faker.date
        .between({
          from: DateTime.convertirEnValueType(
            this.lauréatWorld.notifierLauréatFixture.notifiéLe,
          ).ajouterNombreDeJours(1).date,
          to: DateTime.now().date,
        })
        .toISOString(),
      utilisateur: faker.internet.email(),
      raison: faker.word.words(),
      attestation: faker.potentiel.document(),
      rapportAssocié: faker.potentiel.document(),
      preuve: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#date = fixture.date;
    this.#dateTransmissionAuCocontractant = fixture.dateTransmissionAuCocontractant;
    this.#utilisateur = fixture.utilisateur;
    this.#raison = fixture.raison;
    this.#attestation = fixture.attestation;
    this.#rapportAssocié = fixture.rapportAssocié;
    this.#preuve = fixture.preuve;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    return {
      dateAchèvementRéel: DateTime.convertirEnValueType(this.dateTransmissionAuCocontractant),

      ...(this.attestation && {
        attestation: Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
          identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
          enregistréLe: this.date,
          attestation: this.attestation,
        }),
      }),
      ...(this.rapportAssocié && {
        rapportAssocié: Lauréat.Achèvement.DocumentAchèvement.rapportAssocié({
          identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
          enregistréLe: this.date,
          rapportAssocie: this.rapportAssocié,
        }),
      }),
      ...(this.preuve && {
        preuveTransmissionAuCocontractant:
          Lauréat.Achèvement.DocumentAchèvement.preuveTransmissionAttestationConformité({
            identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
            dateTransmissionAuCocontractant: this.dateTransmissionAuCocontractant,
            preuveTransmissionAuCocontractant: this.preuve,
          }),
      }),
      misÀJourLe: DateTime.convertirEnValueType(this.date),
      misÀJourPar: Email.convertirEnValueType(this.utilisateur),
    };
  }
}
