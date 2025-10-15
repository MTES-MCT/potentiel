import { faker } from '@faker-js/faker';

import { Candidature } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../fixture';
import { LauréatWorld } from '../../lauréat.world';

interface ModifierTypologieDuProjet {
  readonly modifiéeLe: string;
  readonly modifiéePar: string;
  readonly typologieDuProjet: { typologie: string; détails?: string }[];
}

export class ModifierTypologieDuProjetFixture
  extends AbstractFixture<ModifierTypologieDuProjet>
  implements ModifierTypologieDuProjet
{
  #modifiéeLe!: string;

  get modifiéeLe(): string {
    return this.#modifiéeLe;
  }

  #modifiéePar!: string;

  get modifiéePar(): string {
    return this.#modifiéePar;
  }

  #typologieDuProjet!: ModifierTypologieDuProjet['typologieDuProjet'];

  get typologieDuProjet(): ModifierTypologieDuProjet['typologieDuProjet'] {
    return this.#typologieDuProjet;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(partialData?: Partial<ModifierTypologieDuProjet>): Readonly<ModifierTypologieDuProjet> {
    const fixture: ModifierTypologieDuProjet = {
      modifiéeLe: faker.date.recent().toISOString(),
      modifiéePar: faker.internet.email(),
      typologieDuProjet: faker.helpers
        .arrayElements(
          Candidature.TypologieDuProjet.typologies.filter(
            (t) =>
              !this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.typologieDuProjet
                .map((t) => t.typologie)
                .includes(t),
          ),
        )
        .map((typologie) => ({
          typologie,
          détails: faker.word.words(),
        })),
      ...partialData,
    };

    this.#modifiéeLe = fixture.modifiéeLe;
    this.#modifiéePar = fixture.modifiéePar;
    this.#typologieDuProjet = fixture.typologieDuProjet;

    this.aÉtéCréé = true;
    return fixture;
  }
}
