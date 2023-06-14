import { GestionnaireRéseauReadModel } from '@potentiel/domain-views';
import { sleep } from '../helpers/sleep';
import { mediator } from 'mediateur';
import { DomainUseCase, convertirEnIdentifiantGestionnaireRéseau } from '@potentiel/domain';

export class GestionnaireRéseauWorld {
  #gestionnairesRéseauCréés: Map<string, string> = new Map();
  #codeEIC!: string;

  get codeEIC() {
    return this.#codeEIC || '';
  }

  set codeEIC(value: string) {
    this.#codeEIC = value;
  }

  #raisonSociale!: string;

  get raisonSociale() {
    return this.#raisonSociale || '';
  }

  set raisonSociale(value: string) {
    this.#raisonSociale = value;
  }

  #légende!: string;

  get légende() {
    return this.#légende || '';
  }

  set légende(value: string) {
    this.#légende = value;
  }

  #format!: string;

  get format() {
    return this.#format || '';
  }

  set format(value: string) {
    this.#format = value;
  }

  #expressionReguliere!: string;

  get expressionReguliere() {
    return this.#expressionReguliere || '';
  }

  set expressionReguliere(value: string) {
    this.#expressionReguliere = value;
  }

  #enedis!: GestionnaireRéseauReadModel;

  get enedis() {
    if (!this.#enedis) {
      throw new Error('Enedis not initialized');
    }
    return this.#enedis;
  }

  constructor() {}

  async createEnedis() {
    this.#enedis = {
      codeEIC: '17X100A100A0001A',
      raisonSociale: 'Enedis',
      type: 'gestionnaire-réseau',
      aideSaisieRéférenceDossierRaccordement: {
        format: '',
        légende: '',
        expressionReguliere: `[a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}`,
      },
    };

    this.#gestionnairesRéseauCréés.set('Inconnu', 'CodeEICInconnu');

    await this.createGestionnaireRéseau(
      this.#enedis.codeEIC,
      this.#enedis.raisonSociale,
      this.#enedis.aideSaisieRéférenceDossierRaccordement.expressionReguliere,
    );
  }

  async createGestionnaireRéseau(
    codeEIC: string,
    raisonSociale: string,
    expressionReguliere: string = '.',
  ) {
    await mediator.send<DomainUseCase>({
      type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
      data: {
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          format: '',
          légende: '',
          expressionReguliere,
        },
      },
    });
    this.codeEIC = codeEIC;
    this.#gestionnairesRéseauCréés.set(raisonSociale, codeEIC);
    await sleep(100);
  }

  rechercherCodeEIC(raisonSociale: string) {
    const codeEIC = this.#gestionnairesRéseauCréés.get(raisonSociale);

    if (!codeEIC) {
      throw new Error(`Aucun CodeEIC correspondant à ${raisonSociale}`);
    }

    return codeEIC;
  }
}
