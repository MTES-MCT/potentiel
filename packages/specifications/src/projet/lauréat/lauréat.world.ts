import { IdentifiantProjet, convertirEnIdentifiantProjet } from '@potentiel/domain';
import { ProjetReadModel } from '@potentiel/domain-views';
import { none } from '@potentiel/monads';

type LauréatFixture = {
  nom: string;
  identifiantProjet: IdentifiantProjet;
  projet?: ProjetReadModel;
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

  constructor() {
    this.#identifiantProjet = convertirEnIdentifiantProjet({
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      famille: none,
      numéroCRE: '23',
    });
  }
}
