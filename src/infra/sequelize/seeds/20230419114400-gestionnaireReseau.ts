import { Unsubscribe } from '@potentiel/core-domain';
import {
  ajouterGestionnaireRéseauCommandHandlerFactory,
  setupEventHandlers,
} from '@potentiel/domain';
import { loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import { createProjection, findProjection, updateProjection } from '@potentiel/pg-projections';

export default {
  up: async () => {
    let unsubscribe: Promise<Unsubscribe[]> | undefined;
    try {
      unsubscribe = setupEventHandlers({
        create: createProjection,
        find: findProjection,
        subscribe,
        update: updateProjection,
      });

      const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
        publish,
        loadAggregate,
      });

      await ajouterGestionnaireRéseau({
        codeEIC: '12345',
        raisonSociale: 'Potentiel dev',
        aideSaisieRéférenceDossierRaccordement: {
          format: 'XXXXX',
          légende: 'cinq chiffres',
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      if (unsubscribe) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        await unsubscribe;
      }
    }
  },
};
