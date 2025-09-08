import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';

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
  set identifiantProjet(value: IdentifiantProjet.ValueType) {
    this.#identifiantProjet = value;
  }

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #nomProjet: string;

  get nomProjet() {
    return this.#nomProjet;
  }

  #dateDésignation: string;

  get dateDésignation() {
    return this.#dateDésignation;
  }

  constructor() {
    this.#recoursWorld = new RecoursWord();
    this.#notifierEliminéFixture = new NotifierÉliminéFixture();
    this.#nomProjet = 'Du boulodrome de Marseille';
    this.#dateDésignation = new Date('2022-10-27').toISOString();

    this.#identifiantProjet = IdentifiantProjet.convertirEnValueType(`PPE2 - Eolien#2##23`);
  }

  // statut: StatutProjet.ValueType;
  // attestationDésignation?: DocumentProjet.ValueType;
  // unitéPuissance: UnitéPuissance.ValueType;

  mapToExpected() {
    const expected: Éliminé.ConsulterÉliminéReadModel = {
      identifiantProjet: this.identifiantProjet,
      ...this.notifierEliminéFixture.mapToExpected(),
    };

    return expected;
  }
}
