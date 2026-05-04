import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { AjouterGestionnaireRéseauFixture } from './fixture/ajouterGestionnaireRéseau.fixture.js';
import { ModifierGestionnaireRéseauFixture } from './fixture/modifierGestionnaireRéseau.fixture.js';

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
  #ajouterGestionnaireRéseauFixture: AjouterGestionnaireRéseauFixture;
  get ajouterGestionnaireRéseauFixture() {
    return this.#ajouterGestionnaireRéseauFixture;
  }

  #modifierGestionnaireRéseauFixture: ModifierGestionnaireRéseauFixture;
  get modifierGestionnaireRéseauFixture() {
    return this.#modifierGestionnaireRéseauFixture;
  }

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

  constructor() {
    this.#ajouterGestionnaireRéseauFixture = new AjouterGestionnaireRéseauFixture();
    this.#modifierGestionnaireRéseauFixture = new ModifierGestionnaireRéseauFixture();
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    return {
      ...(exemple['Code EIC'] ? { codeEIC: exemple['Code EIC'] } : {}),
      raisonSociale: exemple['Raison sociale'],
      expressionReguliere: exemple['Expression régulière'],
    };
  }

  mapToExpected() {
    const gestionnaireRéseauBaseFixture = this.modifierGestionnaireRéseauFixture.aÉtéCréé
      ? this.modifierGestionnaireRéseauFixture
      : this.ajouterGestionnaireRéseauFixture;

    const expected: GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel = {
      aideSaisieRéférenceDossierRaccordement: {
        format: gestionnaireRéseauBaseFixture.format,
        légende: gestionnaireRéseauBaseFixture.légende,
        expressionReguliere: ExpressionRegulière.convertirEnValueType(
          gestionnaireRéseauBaseFixture.expressionReguliere,
        ),
      },
      identifiantGestionnaireRéseau:
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
          gestionnaireRéseauBaseFixture.codeEIC,
        ),
      raisonSociale: gestionnaireRéseauBaseFixture.raisonSociale,
      contactEmail: Email.convertirEnValueType(gestionnaireRéseauBaseFixture.contactEmail),
    };

    return expected;
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
