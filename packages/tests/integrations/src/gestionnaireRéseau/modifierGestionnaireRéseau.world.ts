import { World } from '@cucumber/cucumber';
import {
  createGestionnaireRéseauAggregateId,
  GestionnaireRéseauInconnuError,
} from '@potentiel/domain';
import { publish } from '@potentiel/pg-event-sourcing';

export class ModifierGestionnaireRéseauWorld extends World {
  accessor error: GestionnaireRéseauInconnuError | undefined;

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
