import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface ModifierInstallateur {
  readonly modifiéLe: string;
  readonly modifiéPar: string;
  readonly installateur: string;
  readonly raison: string;
  readonly pièceJustificative: PièceJustificative;
}

export class ModifierInstallateurFixture
  extends AbstractFixture<ModifierInstallateur>
  implements ModifierInstallateur
{
  #modifiéLe!: string;

  get modifiéLe(): string {
    return this.#modifiéLe;
  }

  #modifiéPar!: string;

  get modifiéPar(): string {
    return this.#modifiéPar;
  }

  #installateur!: string;

  get installateur(): string {
    return this.#installateur;
  }

  #pièceJustificative!: PièceJustificative;

  get pièceJustificative(): ModifierInstallateur['pièceJustificative'] {
    return this.#pièceJustificative;
  }

  #raison!: string;
  get raison(): string {
    return this.#raison;
  }

  créer(partialData?: Partial<ModifierInstallateur>): Readonly<ModifierInstallateur> {
    const fixture: ModifierInstallateur = {
      modifiéLe: faker.date.recent().toISOString(),
      modifiéPar: faker.internet.email(),
      installateur: faker.company.name(),
      pièceJustificative: faker.potentiel.document(),
      raison: faker.word.words(),
      ...partialData,
    };

    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;
    this.#installateur = fixture.installateur;
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;
    return fixture;
  }
}
