import { faker } from '@faker-js/faker';

import { ExpressionRegulière } from '@potentiel-domain/common';

import { AbstractFixture } from '../../fixture.js';
import { GestionnaireRéseauWorld } from '../gestionnaireRéseau.world.js';

interface AjouterGestionnaireRéseau {
  readonly codeEIC: string;
  readonly raisonSociale: string;
  readonly format: string;
  readonly légende: string;
  readonly expressionReguliere: string;
  readonly contactEmail: string;
}

export class AjouterGestionnaireRéseauFixture
  extends AbstractFixture<AjouterGestionnaireRéseau>
  implements AjouterGestionnaireRéseau
{
  #gestionnaireRéseauWorld: GestionnaireRéseauWorld;

  constructor(gestionnaireRéseauWorld: GestionnaireRéseauWorld) {
    super();
    this.#gestionnaireRéseauWorld = gestionnaireRéseauWorld;
  }

  get gestionnaireRéseauWorld(): GestionnaireRéseauWorld {
    return this.#gestionnaireRéseauWorld;
  }

  #codeEIC!: string;

  get codeEIC(): string {
    return this.#codeEIC;
  }

  #raisonSociale!: string;

  get raisonSociale(): string {
    return this.#raisonSociale;
  }

  #format!: string;

  get format(): string {
    return this.#format;
  }

  #légende!: string;

  get légende(): string {
    return this.#légende;
  }

  #expressionReguliere!: string;

  get expressionReguliere(): string {
    return this.#expressionReguliere;
  }

  #contactEmail!: string;

  get contactEmail(): string {
    return this.#contactEmail;
  }

  créer(partialFixture?: Partial<AjouterGestionnaireRéseau>): AjouterGestionnaireRéseau {
    const fixture: AjouterGestionnaireRéseau = {
      codeEIC: faker.animal.petName(),
      raisonSociale: faker.company.name(),
      contactEmail: faker.internet.email(),
      format: faker.helpers.fromRegExp(ExpressionRegulière.accepteTout.expression),
      légende: faker.company.catchPhraseDescriptor(),
      expressionReguliere: ExpressionRegulière.accepteTout.expression,
      ...partialFixture,
    };

    this.#codeEIC = fixture.codeEIC;
    this.#raisonSociale = fixture.raisonSociale;
    this.#contactEmail = fixture.contactEmail;
    this.#format = fixture.format;
    this.#expressionReguliere = fixture.expressionReguliere;
    this.#légende = fixture.légende;

    this.aÉtéCréé = true;

    this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(fixture.raisonSociale, {
      codeEIC: fixture.codeEIC,
      raisonSociale: fixture.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        expressionReguliere: fixture.expressionReguliere,
        format: fixture.format,
        légende: fixture.légende,
      },
      contactEmail: fixture.contactEmail,
    });

    return fixture;
  }
}
