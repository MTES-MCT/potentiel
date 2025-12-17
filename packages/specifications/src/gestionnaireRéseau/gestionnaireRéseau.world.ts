type GestionnaireRéseau = {
  codeEIC: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format?: string;
    légende?: string;
    expressionReguliere?: string;
  };
  contactEmail?: string;
};

type OREItem = {
  commune: string;
  codePostal: string;
  raisonSociale: string;
  codeEIC: string;
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

  #référentielOREFixtures: OREItem[] = [];
  get référentielOREFixtures() {
    return this.#référentielOREFixtures;
  }

  getGestionnaire(codeEIC: string): GestionnaireRéseau {
    const gestionnaireRéseau = [...this.#gestionnairesRéseauFixtures.values()].find(
      (x) => x.codeEIC === codeEIC,
    );

    if (!gestionnaireRéseau) {
      throw new Error(
        `Aucun gestionnaire réseau correspondant à ${codeEIC} dans les jeux de données`,
      );
    }

    return gestionnaireRéseau;
  }

  rechercherGestionnaireRéseauFixture(raisonSociale: string): GestionnaireRéseau {
    const gestionnaireRéseau = this.#gestionnairesRéseauFixtures.get(raisonSociale);

    if (!gestionnaireRéseau) {
      throw new Error(
        `Aucun gestionnaire réseau correspondant à ${raisonSociale} dans les jeux de données`,
      );
    }

    return JSON.parse(JSON.stringify(gestionnaireRéseau));
  }

  rechercherOREParVille({ codePostal, commune }: { codePostal: string; commune: string }) {
    const item = this.#référentielOREFixtures.find(
      (ore) => ore.codePostal === codePostal && ore.commune === commune,
    );
    if (item) {
      return {
        codeEIC: item.codeEIC,
        raisonSociale: item.raisonSociale,
      };
    }
    return;
  }
}
