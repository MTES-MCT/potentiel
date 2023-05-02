import {
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauReadModel,
  createGestionnaireRéseauAggregateId,
} from '@potentiel/domain';
import { publish } from '@potentiel/pg-event-sourcing';
import { sleep } from '../helpers/sleep';

export class GestionnaireRéseauWorld {
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
      },
    };

    await this.createGestionnaireRéseau(this.#enedis.codeEIC, this.#enedis.raisonSociale);
  }

  async createGestionnaireRéseau(codeEIC: string, raisonSociale: string) {
    const event: GestionnaireRéseauAjoutéEvent = {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          format: '',
          légende: '',
        },
      },
    };
    await publish(createGestionnaireRéseauAggregateId(codeEIC), event);
    this.codeEIC = codeEIC;
    await sleep(100);
  }
}
