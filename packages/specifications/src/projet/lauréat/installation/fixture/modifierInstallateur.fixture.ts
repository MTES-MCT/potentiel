import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface ModifierInstallateur {
  readonly modifiéLe: string;
  readonly modifiéPar: string;
  readonly installateur: string;
  readonly raison: string;
  readonly pièceJustificative: {
    readonly content: string;
    readonly format: string;
  };
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

  #format!: string;
  #content!: string;

  get pièceJustificative(): ModifierInstallateur['pièceJustificative'] {
    return {
      format: this.#format,
      content: this.#content,
    };
  }

  #raison!: string;
  get raison(): string {
    return this.#raison;
  }

  créer(partialData?: Partial<ModifierInstallateur>): Readonly<ModifierInstallateur> {
    const content = faker.word.words();

    const fixture: ModifierInstallateur = {
      modifiéLe: faker.date.recent().toISOString(),
      modifiéPar: faker.internet.email(),
      installateur: faker.company.name(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content,
      },
      raison: faker.word.words(),
      ...partialData,
    };

    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;
    this.#installateur = fixture.installateur;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;
    return fixture;
  }
}
