import { IdentifiantProjet } from '@potentiel-domain/common';

import { AbandonWord } from './abandon/abandon.world';
import { ReprésentantLégalWorld } from './représentant-légal/représentantLégal.world';
import { ActionnaireWorld } from './actionnaire/actionnaire.world';
import { ModifierLauréatFixture } from './fixtures/modifierLauréat.fixture';
import { NotifierLauréatFixture } from './fixtures/notifierLauréat.fixture';

type LauréatFixture = {
  nom: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDésignation: string;
  appelOffre: string;
  période: string;
};

export class LauréatWorld {
  #lauréatFixtures: Map<string, LauréatFixture> = new Map();
  get lauréatFixtures() {
    return this.#lauréatFixtures;
  }

  #notifierLauréatFixture: NotifierLauréatFixture;
  get notifierLauréatFixture() {
    return this.#notifierLauréatFixture;
  }

  #modifierLauréatFixture: ModifierLauréatFixture;
  get modifierLauréatFixture() {
    return this.#modifierLauréatFixture;
  }

  /** @deprecated use `identifiantProjet` */
  rechercherLauréatFixture(nom: string): LauréatFixture {
    const lauréat = this.#lauréatFixtures.get(nom);

    if (!lauréat) {
      throw new Error(`Aucun projet lauréat correspondant à ${nom} dans les jeux de données`);
    }

    return lauréat;
  }

  #identifiantProjet: IdentifiantProjet.ValueType;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  set identifiantProjet(value: IdentifiantProjet.ValueType) {
    this.#identifiantProjet = value;
  }

  #abandonWorld!: AbandonWord;

  get abandonWorld() {
    return this.#abandonWorld;
  }

  #représentantLégalWorld!: ReprésentantLégalWorld;

  get représentantLégalWorld() {
    return this.#représentantLégalWorld;
  }

  #actionnaireWorld!: ActionnaireWorld;

  get actionnaireWorld() {
    return this.#actionnaireWorld;
  }

  #dateDésignation: string;

  get dateDésignation() {
    return this.#dateDésignation;
  }

  constructor() {
    this.#abandonWorld = new AbandonWord();
    this.#représentantLégalWorld = new ReprésentantLégalWorld();
    this.#actionnaireWorld = new ActionnaireWorld();

    this.#notifierLauréatFixture = new NotifierLauréatFixture();
    this.#modifierLauréatFixture = new ModifierLauréatFixture();

    this.#identifiantProjet = IdentifiantProjet.convertirEnValueType(`PPE2 - Eolien#1##23`);
    this.#dateDésignation = new Date('2022-10-27').toISOString();
  }

  mapToExpected() {
    return {
      identifiantProjet: this.identifiantProjet,
      ...this.notifierLauréatFixture.mapToExpected(),
      ...this.modifierLauréatFixture.mapToExpected(),
    };
  }
}
