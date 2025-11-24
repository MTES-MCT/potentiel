import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

export interface ModifierNomProjet {
  readonly nomProjet: string;
  readonly modifiéLe: string;
  readonly modifiéPar: string;
  readonly pièceJustificative?: { format: string; content: string };
  readonly raison: string;
}

export class ModifierNomProjetFixture
  extends AbstractFixture<ModifierNomProjet>
  implements ModifierNomProjet
{
  #nomProjet!: string;

  get nomProjet(): string {
    return this.#nomProjet;
  }

  #modifiéLe!: string;

  get modifiéLe(): string {
    return this.#modifiéLe;
  }
  #modifiéPar!: string;

  get modifiéPar(): string {
    return this.#modifiéPar;
  }
  #format!: string;
  #content!: string;

  get pièceJustificative(): ModifierNomProjet['pièceJustificative'] {
    return {
      format: this.#format,
      content: this.#content,
    };
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierNomProjet>> & { modifiéPar: string },
  ): Readonly<ModifierNomProjet> {
    const content = faker.word.sample();

    const fixture = {
      nomProjet: faker.food.dish(),
      modifiéLe: faker.date.recent().toISOString(),
      raison: faker.company.buzzPhrase(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content,
      },
      ...partialFixture,
    };

    this.#nomProjet = fixture.nomProjet;
    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;
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
