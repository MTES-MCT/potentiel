import { IdentifiantProjet } from '@potentiel-domain/common';

import { RecoursWord } from './recours/recours.world';

type EliminéFixture = {
  nom: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDésignation: string;
};

export class EliminéWorld {
  #eliminéFixtures: Map<string, EliminéFixture> = new Map();
  get eliminéFixtures() {
    return this.#eliminéFixtures;
  }
  rechercherEliminéFixture(nom: string): EliminéFixture {
    const eliminé = this.#eliminéFixtures.get(nom);

    if (!eliminé) {
      throw new Error(`Aucun projet éliminé correspondant à ${nom} dans les jeux de données`);
    }

    return eliminé;
  }

  #identifiantProjet: IdentifiantProjet.ValueType;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #recoursWorld!: RecoursWord;

  get recoursWorld() {
    return this.#recoursWorld;
  }

  constructor() {
    this.#recoursWorld = new RecoursWord();

    this.#identifiantProjet = IdentifiantProjet.convertirEnValueType(`PPE2 - Eolien#1##23`);
  }
}
