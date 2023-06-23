import { ajouterGestionnaireRéseau } from './helpers/ajouterGestionnaireRéseau';
import { ajouterEnedis } from './helpers/ajouterEnedis';
import { modifierGestionnaireRéseau } from './helpers/modifierGestionnaireRéseau';
import { devraitÊtreDisponibleDansRéférentiel } from './helpers/devraitÊtreDisponibleDansRéférentiel';
import { devraitÊtreConsultable } from './helpers/devraitÊtreConsultable';
import { devraitÊtreUnRéférenceValideOuInvalide } from './helpers/devraitÊtreUnRéférenceValideOuInvalide';

type GestionnaireRéseau = {
  codeEIC: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: string;
  };
};

export class GestionnaireRéseauWorld {
  #gestionnairesRéseauFixtures: Map<string, GestionnaireRéseau> = new Map();
  get gestionnairesRéseauFixtures() {
    return this.#gestionnairesRéseauFixtures;
  }

  constructor() {}

  ajouterEnedis = ajouterEnedis.bind(this);
  ajouterGestionnaireRéseau = ajouterGestionnaireRéseau.bind(this);
  modifierGestionnaireRéseau = modifierGestionnaireRéseau.bind(this);

  rechercherGestionnaireRéseauFixture(raisonSociale: string): GestionnaireRéseau {
    const gestionnaireRéseau = this.#gestionnairesRéseauFixtures.get(raisonSociale);

    if (!gestionnaireRéseau) {
      throw new Error(
        `Aucun gestionnaire réseau correspondant à ${raisonSociale} dans les jeux de données`,
      );
    }

    return JSON.parse(JSON.stringify(gestionnaireRéseau));
  }

  devraitÊtreDisponibleDansRéférentiel = devraitÊtreDisponibleDansRéférentiel.bind(this);
  devraitÊtreConsultable = devraitÊtreConsultable.bind(this);
  devraitÊtreUnRéférenceValideOuInvalide = devraitÊtreUnRéférenceValideOuInvalide.bind(this);
}
