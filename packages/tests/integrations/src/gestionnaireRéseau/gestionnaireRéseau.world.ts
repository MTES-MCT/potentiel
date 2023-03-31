import { World } from '@cucumber/cucumber';
import {
  createGestionnaireRéseauAggregateId,
} from '@potentiel/domain';
import { publish } from '@potentiel/pg-event-sourcing';

export class GestionnaireRéseauWorld extends World {
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

  #error!: Error;

  get error() {
    return this.#error || new Error('Error was not setted in the test context');
  }

  set error(value: Error) {
    this.#error = value;
  }

  async createGestionnaireRéseau(codeEIC: string, raisonSociale: string) {
    await publish(createGestionnaireRéseauAggregateId(codeEIC), {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale,
      },
    });
    this.codeEIC = codeEIC;
  }
}
