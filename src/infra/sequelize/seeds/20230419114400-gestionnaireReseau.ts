import {
  enregistrerAccuséRéceptionDemandeComplèteRaccordement,
  enregistrerFichierPropositionTechniqueEtFinancière,
} from '@potentiel/infra-adapters';
import {
  UnsetupDomain,
  buildAjouterGestionnaireRéseauCommand,
  setupDomain,
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
    let unsetupDomain: UnsetupDomain | undefined;
    try {
      const unsetupDomain = setupDomain({
        command: {
          loadAggregate,
          publish,
          enregistrerAccuséRéceptionDemandeComplèteRaccordement,
          enregistrerFichierPropositionTechniqueEtFinancière,
        },
        query: {
          find: findProjection,
          list: listProjection,
        },
        event: {
          create: createProjection,
          find: findProjection,
          update: updateProjection,
          remove: removeProjection,
        },
        subscribe,
      });

      const ajouterGestionnaireRéseauCommand = buildAjouterGestionnaireRéseauCommand({
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
      if (unsetupDomain) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        await unsetupDomain();
      }
    }
  },
};
