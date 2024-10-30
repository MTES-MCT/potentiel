import { IdentifiantProjet } from '@potentiel-domain/common';

import { RecoursWord } from './recours/recours.world';
import { NotifierÉliminéFixture } from './fixtures/notifierÉliminé.fixture';

type ÉliminéFixture = {
  nom: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDésignation: string;
};

export class ÉliminéWorld {
  #éliminéFixtures: Map<string, ÉliminéFixture> = new Map();

  /** @deprecated use notifierEliminéFixture */
  get éliminéFixtures() {
    return this.#éliminéFixtures;
  }

  /** @deprecated use notifierEliminéFixture */
  rechercherÉliminéFixture(nom: string): ÉliminéFixture {
    const éliminé = this.#éliminéFixtures.get(nom);

    if (!éliminé) {
      throw new Error(`Aucun projet éliminé correspondant à ${nom} dans les jeux de données`);
    }

    return éliminé;
  }

  #recoursWorld!: RecoursWord;

  get recoursWorld() {
    return this.#recoursWorld;
  }

  #notifierEliminéFixture: NotifierÉliminéFixture;
  get notifierEliminéFixture() {
    return this.#notifierEliminéFixture;
  }

  #identifiantProjet: IdentifiantProjet.ValueType;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #nomProjet: string;

  get nomProjet() {
    return this.#nomProjet;
  }

  constructor() {
    this.#recoursWorld = new RecoursWord();
    this.#notifierEliminéFixture = new NotifierÉliminéFixture();
    this.#nomProjet = 'Du boulodrome de Marseille';

    this.#identifiantProjet = IdentifiantProjet.convertirEnValueType(`PPE2 - Eolien#2##23`);
  }
}
