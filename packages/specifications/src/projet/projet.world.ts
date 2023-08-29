import { IdentifiantProjet, convertirEnIdentifiantProjet } from '@potentiel/domain';
import { none } from '@potentiel/monads';

type ProjetFixture = {
  nom: string;
  identifiantProjet: IdentifiantProjet;
  legacyId?: string;
  appelOffre?: string;
  période?: string;
  famille?: string;
  numéroCRE?: string;
  commune?: string;
  région?: string;
  département?: string;
  statut?: string;
};

export class ProjetWorld {
  #projetFixtures: Map<string, ProjetFixture> = new Map();
  get projetFixtures() {
    return this.#projetFixtures;
  }
  rechercherProjetFixture(nomProjet: string): ProjetFixture {
    const projet = this.#projetFixtures.get(nomProjet);

    if (!projet) {
      throw new Error(`Aucun projet correspondant à ${nomProjet} dans les jeux de données`);
    }

    return projet;
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
