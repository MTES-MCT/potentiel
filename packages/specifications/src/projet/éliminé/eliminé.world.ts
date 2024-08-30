import { IdentifiantProjet } from '@potentiel-domain/common';

import { RecoursWord } from './recours/recours.world';
import { NotifierÉliminéFixture } from './fixtures/notifierÉliminé.fixture';

type EliminéFixture = {
  nom: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDésignation: string;
};

export class EliminéWorld {
  #eliminéFixtures: Map<string, EliminéFixture> = new Map();
  /** @deprecated use notifierEliminéFixture */
  get eliminéFixtures() {
    return this.#eliminéFixtures;
  }
  /** @deprecated use notifierEliminéFixture */
  rechercherEliminéFixture(nom: string): EliminéFixture {
    const eliminé = this.#eliminéFixtures.get(nom);

    if (!eliminé) {
      throw new Error(`Aucun projet éliminé correspondant à ${nom} dans les jeux de données`);
    }

    return eliminé;
  }

  #recoursWorld!: RecoursWord;

  get recoursWorld() {
    return this.#recoursWorld;
  }

  #notifierEliminéFixture: NotifierÉliminéFixture;
  get notifierEliminéFixture() {
    return this.#notifierEliminéFixture;
  }

  constructor() {
    this.#recoursWorld = new RecoursWord();
    this.#notifierEliminéFixture = new NotifierÉliminéFixture();
  }
}
