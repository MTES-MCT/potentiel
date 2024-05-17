import { mediator } from 'mediateur';

import {
  GestionnaireRéseau,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';

import { OreGestionnaire, getAllGRDs } from '@potentiel-infrastructure/ore-client';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  findProjection,
  listProjection,
  listProjectionV2,
} from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';
import { addNewGestionnairesDeRéseau } from './addNewGestionnairesDeRéseau';
import { updateExistingGestionnairesDeRéseauContactEmail } from './updateExistingGestionnairesDeRéseauContactEmail';

export type Params = {
  gestionnairesFromORE: Array<OreGestionnaire>;
  gestionnairesRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel;
};

registerRéseauUseCases({
  loadAggregate,
});

registerRéseauQueries({
  list: listProjection,
  listV2: listProjectionV2,
  find: findProjection,
});

(async () => {
  getLogger().info('[updateGestionnaireDeRéseau] Starting script');

  try {
    const gestionnairesFromORE = await getAllGRDs();

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    await updateExistingGestionnairesDeRéseauContactEmail({
      gestionnairesFromORE,
      gestionnairesRéseau,
    });

    await addNewGestionnairesDeRéseau({
      gestionnairesFromORE,
      gestionnairesRéseau,
    });

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
