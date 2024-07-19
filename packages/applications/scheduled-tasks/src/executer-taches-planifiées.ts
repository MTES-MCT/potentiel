import { mediator } from 'mediateur';

import {
  ExécuterTâchePlanifiéeUseCase,
  ListerTâchesPlanifiéesQuery,
} from '@potentiel-domain/tache-planifiee';
import { DateTime } from '@potentiel-domain/common';
import {} from '@potentiel-domain/laureat';

(async () => {
  const today = DateTime.now().formatterDate();

  const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
    type: 'Tâche.Query.ListerTâchesPlanifiées',
    data: {
      àExécuterLe: today,
    },
  });

  for (const tâche of tâches.items) {
    switch (tâche.typeTâchePlanifiée.type) {
      case 'garanties-financières.échoir':
      // TODO mediator.send<GarantiesFinancières.AccorderDemandeMainlevéeGarantiesFinancièresUseCase>("")
    }

    await mediator.send<ExécuterTâchePlanifiéeUseCase>({
      type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
      data: {
        identifiantProjetValue: tâche.identifiantProjet.formatter(),
        typeTâchePlanifiéeValue: tâche.typeTâchePlanifiée.type,
      },
    });
  }
})();
