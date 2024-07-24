import { mediator } from 'mediateur';

import {
  ExécuterTâchePlanifiéeUseCase,
  ListerTâchesPlanifiéesQuery,
} from '@potentiel-domain/tache-planifiee';
import { DateTime } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';
import { InvalidOperationError } from '@potentiel-domain/core';

(async () => {
  const logger = getLogger();
  logger.info('Lancement du script...');
  const today = DateTime.now().formatterDate();

  const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
    type: 'Tâche.Query.ListerTâchesPlanifiées',
    data: {
      àExécuterLe: today,
    },
  });

  logger.info(`Il y a ${tâches.items.length} tâches à exécuter le ${today}`);

  for (const tâche of tâches.items) {
    logger.info(
      `Exécution de ${tâche.typeTâchePlanifiée.type} pour ${tâche.identifiantProjet.formatter()}`,
    );

    try {
      switch (tâche.typeTâchePlanifiée.type) {
        case 'garanties-financières.échoir':
          mediator.send<GarantiesFinancières.ÉchoirGarantiesFinancièresUseCase>({
            type: 'Lauréat.GarantiesFinancières.UseCase.ÉchoirGarantiesFinancières',
            data: {
              identifiantProjetValue: tâche.identifiantProjet.formatter(),
              échuLeValue: DateTime.now().formatter(),
              dateÉchéanceValue: tâche.àExécuterLe.ajouterNombreDeJours(-1).formatter(),
            },
          });
          break;
        default:
          throw new TypeNonGéréError();
      }

      await mediator.send<ExécuterTâchePlanifiéeUseCase>({
        type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
        data: {
          identifiantProjetValue: tâche.identifiantProjet.formatter(),
          typeTâchePlanifiéeValue: tâche.typeTâchePlanifiée.type,
        },
      });
    } catch (e) {
      logger.warn(`Error lors de l'execution de la tâche planifiée`, {
        typeTâchePlanifiée: tâche.typeTâchePlanifiée.type,
        identifiantProjet: tâche.identifiantProjet.formatter(),
        error: (e as Error).message,
      });
    }
  }
  logger.info('Fin du script ✨');
})();

class TypeNonGéréError extends InvalidOperationError {
  constructor() {
    super(`Le type de tâche planifiée n'est pas géré`);
  }
}
