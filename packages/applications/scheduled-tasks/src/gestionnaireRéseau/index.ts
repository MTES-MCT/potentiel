import { mediator } from 'mediateur';

import {
  GestionnaireRéseau,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';
import { récupérerTousLesGRD } from '@potentiel-infrastructure/ore-client';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listProjection,
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
  find: findProjection,
  count: countProjection,
});

(async () => {
  const logger = getLogger('ScheduledTasks.gestionnaireRéseau');
  logger.info('Lancement du script...');

  try {
    const gestionnairesFromORE = await récupérerTousLesGRD();

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    const { àAjouter, àModifier } = mapToRéférencielGRD(gestionnairesFromORE, gestionnairesRéseau);

    await addGRDs(àAjouter);

    await updateGRDs(àModifier);

    logger.info('Fin du script ✨');

    process.exit(0);
  } catch (error) {
    logger.error(error as Error);
  }
})();
