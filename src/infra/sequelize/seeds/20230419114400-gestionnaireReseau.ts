import { Unsubscribe } from '@potentiel/core-domain';
import {
  newAjouterGestionnaireRéseauCommand,
  setupEventHandlers,
  setupMessageHandlers,
} from '@potentiel/domain';
import { loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import { mediator } from 'mediateur';

export default {
  up: async () => {
    let unsubscribe: Promise<Unsubscribe[]> | undefined;
    try {
      setupMessageHandlers({
        commandPorts: {
          loadAggregate,
          publish,
        },
        queryPorts: {
          find: findProjection,
          list: listProjection,
        },
      });

      unsubscribe = setupEventHandlers({
        create: createProjection,
        find: findProjection,
        subscribe,
        update: updateProjection,
        remove: removeProjection,
      });

      const ajouterGestionnaireRéseauCommand = newAjouterGestionnaireRéseauCommand({
        codeEIC: '12345',
        raisonSociale: 'Potentiel dev',
        aideSaisieRéférenceDossierRaccordement: {
          format: 'XXXXX',
          légende: 'cinq chiffres',
        },
      });

      mediator.send(ajouterGestionnaireRéseauCommand);
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
