import {
  IdentifiantProjet,
  IdentifiantProjetValueType,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain-usecases';
import { CandidatureLegacyReadModel } from '@potentiel/domain-views';
import { IdentifiantProjet as IdentifiantProjetCommon } from '@potentiel-domain/common';
import { none } from '@potentiel/monads';
import { AbandonWord } from './abandon/abandon.world';

type LauréatFixture = {
  nom: string;
  identifiantProjet: IdentifiantProjetValueType;
  identitiantProjetValueType: IdentifiantProjetCommon.ValueType;
  projet?: CandidatureLegacyReadModel;
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

  #identifiantProjet: IdentifiantProjet;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #abandonWorld!: AbandonWord;

  get abandonWorld() {
    return this.#abandonWorld;
  }

  constructor() {
    this.#abandonWorld = new AbandonWord();

    this.#identifiantProjet = convertirEnIdentifiantProjet({
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      famille: none,
      numéroCRE: '23',
    });
  }
}
