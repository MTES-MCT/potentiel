import { World } from '@cucumber/cucumber';
import {
  createGestionnaireRéseauAggregateId,
  GestionnaireRéseauDéjàExistantError,
  GestionnaireRéseauInconnuError,
  GestionnaireRéseauReadModel,
} from '@potentiel/domain';
import { publish } from '@potentiel/pg-event-sourcing';

export class GestionnaireRéseauWorld extends World {
  accessor error: GestionnaireRéseauDéjàExistantError | GestionnaireRéseauInconnuError | undefined;
  accessor actual: GestionnaireRéseauReadModel | undefined;
  accessor actualList: ReadonlyArray<GestionnaireRéseauReadModel> | undefined;

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
