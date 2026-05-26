import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';
import type { LauréatWorld } from '../../lauréat.world.js';

interface ModifierAttestationConformité {
  readonly attestation: PièceJustificative;
  readonly rapportAssocié: PièceJustificative;
  readonly modifiéeLe: string;
  readonly modifiéePar: string;
}

export class ModifierAttestationConformitéFixture
  extends AbstractFixture<ModifierAttestationConformité>
  implements ModifierAttestationConformité
{
  #attestation!: ModifierAttestationConformité['attestation'];

  get attestation(): ModifierAttestationConformité['attestation'] {
    return this.#attestation;
  }

  #rapportAssocié!: ModifierAttestationConformité['rapportAssocié'];

  get rapportAssocié(): ModifierAttestationConformité['rapportAssocié'] {
    return this.#rapportAssocié;
  }

  #modifiéeLe!: string;

  get modifiéeLe(): string {
    return this.#modifiéeLe;
  }

  #modifiéePar!: string;

  get modifiéePar(): string {
    return this.#modifiéePar;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(partialFixture?: Partial<ModifierAttestationConformité>): ModifierAttestationConformité {
    const fixture: ModifierAttestationConformité = {
      modifiéeLe: faker.date.soon().toISOString(),
      modifiéePar: faker.internet.email(),
      attestation: faker.potentiel.document(),
      rapportAssocié: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#modifiéePar = fixture.modifiéePar;
    this.#modifiéeLe = fixture.modifiéeLe;
    this.#attestation = fixture.attestation;
    this.#rapportAssocié = fixture.rapportAssocié;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    return {
      attestation: Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        enregistréLe: this.modifiéeLe,
        attestation: this.attestation,
      }),
      rapportAssocié: Lauréat.Achèvement.DocumentAchèvement.rapportAssocié({
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        enregistréLe: this.modifiéeLe,
        rapportAssocie: this.rapportAssocié,
      }),
      misÀJourLe: DateTime.convertirEnValueType(this.modifiéeLe),
      misÀJourPar: Email.convertirEnValueType(this.modifiéePar),
    };
  }
}
