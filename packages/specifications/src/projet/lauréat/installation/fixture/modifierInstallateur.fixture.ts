import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface ModifierInstallateur {
  readonly modifiéLe: string;
  readonly modifiéPar: string;
  readonly installateur: string;
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

  créer(partialData?: Partial<ModifierInstallateur>): Readonly<ModifierInstallateur> {
    const fixture: ModifierInstallateur = {
      modifiéLe: faker.date.recent().toISOString(),
      modifiéPar: faker.internet.email(),
      installateur: faker.company.name(),
      ...partialData,
    };

    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;
    this.#installateur = fixture.installateur;

    this.aÉtéCréé = true;
    return fixture;
  }
}
