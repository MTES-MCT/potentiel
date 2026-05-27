import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';
import type { LauréatWorld } from '../../lauréat.world.js';

interface EnregistrerAttestationConformité {
  readonly attestation: PièceJustificative;
  readonly rapportAssocié: PièceJustificative;
  readonly enregistréeLe: string;
  readonly enregistréePar: string;
}

export class EnregistrerAttestationConformitéFixture
  extends AbstractFixture<EnregistrerAttestationConformité>
  implements EnregistrerAttestationConformité
{
  #attestation!: EnregistrerAttestationConformité['attestation'];

  get attestation(): EnregistrerAttestationConformité['attestation'] {
    return this.#attestation;
  }

  #rapportAssocié!: EnregistrerAttestationConformité['rapportAssocié'];

  get rapportAssocié(): EnregistrerAttestationConformité['rapportAssocié'] {
    return this.#rapportAssocié;
  }

  #enregistréeLe!: string;

  get enregistréeLe(): string {
    return this.#enregistréeLe;
  }

  #enregistréePar!: string;

  get enregistréePar(): string {
    return this.#enregistréePar;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(
    partialFixture?: Partial<EnregistrerAttestationConformité>,
  ): EnregistrerAttestationConformité {
    const fixture: EnregistrerAttestationConformité = {
      enregistréeLe: faker.date.soon().toISOString(),
      enregistréePar: faker.internet.email(),
      attestation: faker.potentiel.document(),
      rapportAssocié: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#enregistréeLe = fixture.enregistréeLe;
    this.#enregistréePar = fixture.enregistréePar;
    this.#attestation = fixture.attestation;
    this.#rapportAssocié = fixture.rapportAssocié;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    return {
      attestation: Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        enregistréLe: this.enregistréeLe,
        attestation: this.attestation,
      }),
      rapportAssocié: Lauréat.Achèvement.DocumentAchèvement.rapportAssocié({
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        enregistréLe: this.enregistréeLe,
        rapportAssocie: this.rapportAssocié,
      }),

      preuveTransmissionAuCocontractant: Option.none,
      misÀJourLe: DateTime.convertirEnValueType(this.enregistréeLe),
      misÀJourPar: Email.convertirEnValueType(this.enregistréePar),
    };
  }
}
