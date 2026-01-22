import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

export interface EnregistrerChangementNomProjet {
  readonly nomProjet: string;
  readonly enregistréLe: string;
  readonly enregistréPar: string;
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly raison: string;
}

export class EnregistrerChangementNomProjetFixture
  extends AbstractFixture<EnregistrerChangementNomProjet>
  implements EnregistrerChangementNomProjet
{
  #nomProjet!: string;

  get nomProjet(): string {
    return this.#nomProjet;
  }

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

  get pièceJustificative(): EnregistrerChangementNomProjet['pièceJustificative'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  créer(
    partialFixture: Partial<Readonly<EnregistrerChangementNomProjet>> & { enregistréPar: string },
  ): Readonly<EnregistrerChangementNomProjet> {
    const content = faker.word.sample();

    const fixture = {
      nomProjet: faker.food.dish(),
      enregistréLe: faker.date.recent().toISOString(),
      raison: faker.company.buzzPhrase(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#nomProjet = fixture.nomProjet;
    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;
    this.#raison = fixture.raison;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    if (!this.aÉtéCréé) {
      return {};
    }

    return {
      nomProjet: this.nomProjet,
    };
  }
}
