import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../fixture.js';

interface ModifierRéférenceDossierRaccordement {
  référenceDossier: string;
  nouvelleRéférenceDossier: string;
}

export class ModifierRéférenceDossierRaccordementFixture
  extends AbstractFixture<ModifierRéférenceDossierRaccordement>
  implements ModifierRéférenceDossierRaccordement
{
  #référenceDossier!: string;
  get référenceDossier(): string {
    return this.#référenceDossier;
  }
  #nouvelleRéférenceDossier!: string;
  get nouvelleRéférenceDossier(): string {
    return this.#nouvelleRéférenceDossier;
  }

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierRéférenceDossierRaccordement>> & {
      identifiantProjet: string;
      référenceDossier: string;
    },
  ): Readonly<ModifierRéférenceDossierRaccordement> {
    const fixture = {
      nouvelleRéférenceDossier: faker.commerce.isbn(),
      ...partialFixture,
    };

    this.#référenceDossier = fixture.référenceDossier;
    this.#nouvelleRéférenceDossier = fixture.nouvelleRéférenceDossier;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.aÉtéCréé = true;
    return fixture;
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    const values: Partial<ModifierRéférenceDossierRaccordement> = {};
    const référenceDossier = exemple['La référence du dossier de raccordement'];
    const nouvelleRéférenceDossier = exemple['La nouvelle référence du dossier de raccordement'];
    if (référenceDossier) {
      values.référenceDossier = référenceDossier;
    }
    if (nouvelleRéférenceDossier) {
      values.nouvelleRéférenceDossier = nouvelleRéférenceDossier;
    }
    return values;
  }
}
