import { faker } from '@faker-js/faker';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';

interface CorrigerNuméroIdentification {
  readonly pièceJustificative: PièceJustificative;
  readonly corrigéLe: string;
  readonly corrigéPar: string;
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

  #corrigéLe!: string;

  get corrigéLe(): string {
    return this.#corrigéLe;
  }

  #corrigéPar!: string;

  get corrigéPar(): string {
    return this.#corrigéPar;
  }

  #siret!: string;

  get siret(): string {
    return this.#siret;
  }

  créer(
    partialData?: Partial<CorrigerNuméroIdentification>,
  ): Readonly<CorrigerNuméroIdentification> {
    const fixture: CorrigerNuméroIdentification = {
      corrigéLe: faker.date.recent().toISOString(),
      corrigéPar: faker.internet.email(),
      pièceJustificative: faker.potentiel.document(),
      siret: faker.potentiel.numéroIdentification().siret,
      ...partialData,
    };

    this.#corrigéLe = fixture.corrigéLe;
    this.#corrigéPar = fixture.corrigéPar;
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#siret = fixture.siret;

    this.aÉtéCréé = true;
    return fixture;
  }
}
