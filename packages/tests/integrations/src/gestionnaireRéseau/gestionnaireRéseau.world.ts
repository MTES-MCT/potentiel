import { World } from '@cucumber/cucumber';
import {
  createGestionnaireRéseauAggregateId,
  GestionnaireRéseauDéjàExistantError,
  GestionnaireRéseauInconnuError,
  GestionnaireRéseauReadModel,
} from '@potentiel/domain';
import { publish } from '@potentiel/pg-event-sourcing';

export class GestionnaireRéseauWorld extends World {
  #codeEIC: string | undefined;

  get codeEIC() {
    return this.#codeEIC || '';
  }
  accessor error: GestionnaireRéseauDéjàExistantError | GestionnaireRéseauInconnuError | undefined;
  accessor actual: GestionnaireRéseauReadModel | undefined;
  accessor actualList: ReadonlyArray<GestionnaireRéseauReadModel> | undefined;
  accessor expected: GestionnaireRéseauReadModel | undefined;

  async createGestionnaireRéseau(codeEIC: string, raisonSociale: string) {
    await publish(createGestionnaireRéseauAggregateId(codeEIC), {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale,
      },
    });
    this.#codeEIC = codeEIC;
  }
}
