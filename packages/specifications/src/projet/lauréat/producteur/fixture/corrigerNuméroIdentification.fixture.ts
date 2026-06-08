import { faker } from '@faker-js/faker';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';

interface CorrigerNuméroIdentification {
  readonly pièceJustificative: PièceJustificative;
  readonly enregistréLe: string;
  readonly enregistréPar: string;
  readonly siret: string;
}

export class CorrigerNuméroIdentificationFixture
  extends AbstractFixture<CorrigerNuméroIdentification>
  implements CorrigerNuméroIdentification
{
  #pièceJustificative!: PièceJustificative;

  get pièceJustificative(): PièceJustificative {
    return this.#pièceJustificative;
  }

  #enregistréLe!: string;

  get enregistréLe(): string {
    return this.#enregistréLe;
  }

  #enregistréPar!: string;

  get enregistréPar(): string {
    return this.#enregistréPar;
  }

  #siret!: string;

  get siret(): string {
    return this.#siret;
  }

  créer(
    partialData?: Partial<CorrigerNuméroIdentification>,
  ): Readonly<CorrigerNuméroIdentification> {
    const fixture: CorrigerNuméroIdentification = {
      enregistréLe: faker.date.recent().toISOString(),
      enregistréPar: faker.internet.email(),
      pièceJustificative: faker.potentiel.document(),
      siret: faker.potentiel.numéroIdentification().siret,
      ...partialData,
    };

    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#siret = fixture.siret;

    this.aÉtéCréé = true;
    return fixture;
  }
}
