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

  #résultatsValidation: Map<string, boolean> = new Map();
  get résultatsValidation() {
    return this.#résultatsValidation;
  }

  constructor() {}

  rechercherGestionnaireRéseauFixture(raisonSociale: string): GestionnaireRéseau {
    const gestionnaireRéseau = this.#gestionnairesRéseauFixtures.get(raisonSociale);

    if (!gestionnaireRéseau) {
      throw new Error(
        `Aucun gestionnaire réseau correspondant à ${raisonSociale} dans les jeux de données`,
      );
    }

    return JSON.parse(JSON.stringify(gestionnaireRéseau));
  }
}
