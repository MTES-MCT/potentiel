import { mediator } from 'mediateur';

import {
  ExécuterTâchePlanifiéeUseCase,
  ListerTâchesPlanifiéesQuery,
  registerTâchePlanifiéeQuery,
  registerTâchePlanifiéeUseCases,
} from '@potentiel-domain/tache-planifiee';
import { DateTime } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

registerTâchePlanifiéeQuery({
  list: listProjection,
});

registerTâchePlanifiéeUseCases({
  loadAggregate,
});

(async () => {
  const logger = getLogger('Scheduler');
  logger.info('Lancement du script...');
  const today = DateTime.now().formatter();

  const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
    type: 'Tâche.Query.ListerTâchesPlanifiées',
    data: {
      àExécuterLe: today,
    },
  });

  logger.info(`Il y a ${tâches.items.length} tâches à exécuter le ${today}`);

  await Promise.all(
    tâches.items.map(async ({ identifiantProjet, typeTâchePlanifiée: { type } }) => {
      try {
        logger.info(`Exécution de ${type} pour ${identifiantProjet.formatter()}`);
        await mediator.send<ExécuterTâchePlanifiéeUseCase>({
          type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            typeTâchePlanifiéeValue: type,
          },
        });
      } catch (e) {
        logger.warn(`Error lors de l'execution de la tâche planifiée`, {
          typeTâchePlanifiée: type,
          identifiantProjet: identifiantProjet.formatter(),
          error: (e as Error).message,
        });
      }
    }),
  );

  logger.info('Fin du script ✨');
})();
