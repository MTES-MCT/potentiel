import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';
import { LauréatWorld } from '../../lauréat.world.js';

interface ModifierAchèvement {
  readonly attestation?: PièceJustificative;
  readonly preuve?: PièceJustificative;
  readonly dateTransmissionAuCocontractant: string;
  readonly date: string;
  readonly utilisateur: string;
}

export class ModifierAchèvementFixture
  extends AbstractFixture<ModifierAchèvement>
  implements ModifierAchèvement
{
  #attestation?: ModifierAchèvement['attestation'];

  get attestation(): ModifierAchèvement['attestation'] {
    return this.#attestation;
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

  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(partialFixture?: Partial<ModifierAchèvement>): ModifierAchèvement {
    const fixture: ModifierAchèvement = {
      dateTransmissionAuCocontractant: faker.date
        .between({
          from: DateTime.convertirEnValueType(
            this.lauréatWorld.notifierLauréatFixture.notifiéLe,
          ).ajouterNombreDeJours(1).date,
          to: DateTime.now().date,
        })
        .toISOString(),
      attestation: faker.potentiel.document(),
      preuve: faker.potentiel.document(),
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

  mapToExpected() {
    return {
      dateAchèvementRéel: DateTime.convertirEnValueType(this.dateTransmissionAuCocontractant),

      ...(this.attestation && {
        attestation: Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
          identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
          enregistréLe: this.date,
          'attestation-conformite': {
            format: this.attestation.format,
          },
        }),
      }),
      ...(this.preuve && {
        preuveTransmissionAuCocontractant:
          Lauréat.Achèvement.DocumentAchèvement.preuveTransmissionAttestationConformité({
            identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
            enregistréLe: this.dateTransmissionAuCocontractant,
            'preuve-transmission-attestation-conformite': {
              format: this.preuve.format,
            },
          }),
      }),
      misÀJourLe: DateTime.convertirEnValueType(this.date),
      misÀJourPar: Email.convertirEnValueType(this.utilisateur),
    };
  }
}
