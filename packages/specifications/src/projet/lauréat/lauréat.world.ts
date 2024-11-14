import { IdentifiantProjet } from '@potentiel-domain/common';

import { AbandonWord } from './abandon/abandon.world';
import { NotifierLauréatFixture } from './fixtures/notifierLauréat.fixture';
import { ReprésentantLégalWorld } from './représentant-légal/représentantLégal.world';

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

  #notifierLauréatFixture: NotifierLauréatFixture;
  get notifierLauréatFixture() {
    return this.#notifierLauréatFixture;
  }

  constructor() {
    this.#abandonWorld = new AbandonWord();
    this.#représentantLégalWorld = new ReprésentantLégalWorld();

    this.#notifierLauréatFixture = new NotifierLauréatFixture();

    this.#identifiantProjet = IdentifiantProjet.convertirEnValueType(`PPE2 - Eolien#1##23`);
  }
}
