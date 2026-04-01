import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface EnregistrerChangementInstallateur {
  readonly enregistréLe: string;
  readonly enregistréPar: string;
  readonly installateur: string;
  readonly pièceJustificative: PièceJustificative;
  readonly raison: string;
}

export class EnregistrerChangementInstallateurFixture
  extends AbstractFixture<EnregistrerChangementInstallateur>
  implements EnregistrerChangementInstallateur
{
  #enregistréLe!: string;

  get enregistréLe(): string {
    return this.#enregistréLe;
  }

  #enregistréPar!: string;

  get enregistréPar(): string {
    return this.#enregistréPar;
  }

  #pièceJustificative!: PièceJustificative;

  get pièceJustificative(): EnregistrerChangementInstallateur['pièceJustificative'] {
    return this.#pièceJustificative;
  }

  #raison!: string;
  get raison(): string {
    return this.#raison;
  }

  #installateur!: string;

  get installateur(): string {
    return this.#installateur;
  }

  créer(
    partialData?: Partial<EnregistrerChangementInstallateur>,
  ): Readonly<EnregistrerChangementInstallateur> {
    const fixture: EnregistrerChangementInstallateur = {
      enregistréLe: faker.date.recent().toISOString(),
      enregistréPar: faker.internet.email(),
      pièceJustificative: faker.potentiel.document(),
      installateur: faker.company.name(),
      raison: faker.word.words(),
      ...partialData,
    };

    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;
    this.#installateur = fixture.installateur;
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;
    return fixture;
  }
}
