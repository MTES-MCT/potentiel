import { mediator } from 'mediateur';

import {
  GestionnaireRéseau,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';

import { getAllGRDs } from '@potentiel-infrastructure/ore-client';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  findProjection,
  listProjection,
  listProjectionV2,
} from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';
import { addGRDs } from './addGRDs';
import { updateGRDs } from './updateGRDs';
import { mapToRéférencielGRD } from './référencielGRD';

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

    const { àAjouter, àModifier } = mapToRéférencielGRD(gestionnairesFromORE, gestionnairesRéseau);

    await addGRDs(àAjouter);

    await updateGRDs(àModifier);

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
