import { World } from '@cucumber/cucumber';
import {
  createGestionnaireRéseauAggregateId,
  GestionnaireRéseauDéjàExistantError,
} from '@potentiel/domain';
import { publish } from '@potentiel/pg-event-sourcing';

export class AjouterGestionnaireRéseauWorld extends World {
  accessor error: GestionnaireRéseauDéjàExistantError | undefined;

  async createGestionnaireRéseau(codeEIC: string, raisonSociale: string) {
    await publish(createGestionnaireRéseauAggregateId(codeEIC), {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale,
      },
    });
  }
}
