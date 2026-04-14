import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';
import { LauréatWorld } from '../../lauréat.world.js';

interface ModifierAttestationConformité {
  readonly attestation: PièceJustificative;
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
      ...partialFixture,
    };

    this.#modifiéePar = fixture.modifiéePar;
    this.#modifiéeLe = fixture.modifiéeLe;
    this.#attestation = fixture.attestation;

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
      misÀJourLe: DateTime.convertirEnValueType(this.modifiéeLe),
      misÀJourPar: Email.convertirEnValueType(this.modifiéePar),
    };
  }
}
