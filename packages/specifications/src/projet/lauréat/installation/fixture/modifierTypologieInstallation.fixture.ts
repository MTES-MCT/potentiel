import { faker } from '@faker-js/faker';

import { Candidature } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../fixture.js';
import { LauréatWorld } from '../../lauréat.world.js';

interface ModifierTypologieInstallation {
  readonly modifiéeLe: string;
  readonly modifiéePar: string;
  readonly typologieInstallation: { typologie: string; détails?: string }[];
  readonly raison: string;
  readonly pièceJustificative: {
    readonly content: string;
    readonly format: string;
  };
}

export class ModifierTypologieInstallationFixture
  extends AbstractFixture<ModifierTypologieInstallation>
  implements ModifierTypologieInstallation
{
  #modifiéeLe!: string;

  get modifiéeLe(): string {
    return this.#modifiéeLe;
  }

  #modifiéePar!: string;

  get modifiéePar(): string {
    return this.#modifiéePar;
  }

  #typologieInstallation!: ModifierTypologieInstallation['typologieInstallation'];

  get typologieInstallation(): ModifierTypologieInstallation['typologieInstallation'] {
    return this.#typologieInstallation;
  }

  #format!: string;
  #content!: string;

  get pièceJustificative(): ModifierTypologieInstallation['pièceJustificative'] {
    return {
      format: this.#format,
      content: this.#content,
    };
  }

  #raison!: string;
  get raison(): string {
    return this.#raison;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(
    partialData?: Partial<ModifierTypologieInstallation>,
  ): Readonly<ModifierTypologieInstallation> {
    const content = faker.word.words();

    const fixture: ModifierTypologieInstallation = {
      modifiéeLe: faker.date.recent().toISOString(),
      modifiéePar: faker.internet.email(),
      typologieInstallation: faker.helpers
        .arrayElements(
          Candidature.TypologieInstallation.typologies.filter(
            (t) =>
              !this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.typologieInstallation
                .map((t) => t.typologie)
                .includes(t),
          ),
        )
        .map((typologie) => ({
          typologie,
          détails: faker.word.words(),
        })),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content,
      },
      raison: faker.word.words(),
      ...partialData,
    };

    this.#modifiéeLe = fixture.modifiéeLe;
    this.#modifiéePar = fixture.modifiéePar;
    this.#typologieInstallation = fixture.typologieInstallation;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;
    return fixture;
  }
}
