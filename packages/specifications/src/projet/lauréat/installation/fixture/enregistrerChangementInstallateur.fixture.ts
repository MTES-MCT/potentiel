import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface EnregistrerChangementInstallateurJustificatif {
  readonly content: string;
  readonly format: string;
}
interface EnregistrerChangementInstallateur {
  readonly enregistréLe: string;
  readonly enregistréPar: string;
  readonly installateur: string;
  readonly pièceJustificative: EnregistrerChangementInstallateurJustificatif;
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

  #format!: string;
  #content!: string;

  get pièceJustificative(): EnregistrerChangementInstallateur['pièceJustificative'] {
    return {
      format: this.#format,
      content: this.#content,
    };
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
    const content = faker.word.words();
    const fixture: EnregistrerChangementInstallateur = {
      enregistréLe: faker.date.recent().toISOString(),
      enregistréPar: faker.internet.email(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content,
      },
      installateur: faker.company.name(),
      raison: faker.word.words(),
      ...partialData,
    };

    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;
    this.#installateur = fixture.installateur;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;
    return fixture;
  }
}
