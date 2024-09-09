import { mediator } from 'mediateur';

import {
  // AnnulerTâchePlanifiéeCommand,
  ListerTâchesPlanifiéesReadModel,
  ListerTâchesPlanifiéesQuery,
  registerTâchePlanifiéeQuery,
  registerTâchePlanifiéeUseCases,
} from '@potentiel-domain/tache-planifiee';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat/';
// import { Option } from '@potentiel-libraries/monads';
// import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';

registerTâchePlanifiéeUseCases({
  loadAggregate,
});

registerTâchePlanifiéeQuery({
  list: listProjection,
});

(async () => {
  try {
    const tâchesPlanifiées = await mediator.send<ListerTâchesPlanifiéesQuery>({
      type: 'Tâche.Query.ListerTâchesPlanifiées',
      data: { catégorieTâche: 'garanties-financières' },
    });

    type TâchePlanifiéeListItem = ListerTâchesPlanifiéesReadModel['items'][number];

    const tâchesParProjet = tâchesPlanifiées.items.reduce(
      (acc, tâche) => {
        if (acc[tâche.identifiantProjet.formatter()]) {
          acc[tâche.identifiantProjet.formatter()].push(tâche);
        } else {
          acc[tâche.identifiantProjet.formatter()] = [tâche];
        }
        return acc;
      },
      {} as Record<IdentifiantProjet.RawType, Array<TâchePlanifiéeListItem>>,
    );

    for (const [, tâches] of Object.entries(tâchesParProjet)) {
      const tâcheÉchoirGarantiesFinancières = tâches.find((t) =>
        GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.convertirEnValueType(
          t.typeTâchePlanifiée,
        ).estÉgaleÀ(GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir),
      );

      const tâcheRappelUnMoisGarantiesFinancières = tâches.find((t) =>
        GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.convertirEnValueType(
          t.typeTâchePlanifiée,
        ).estÉgaleÀ(
          GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois,
        ),
      );

      const tâcheRappelDeuxMoisGarantiesFinancières = tâches.find((t) =>
        GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.convertirEnValueType(
          t.typeTâchePlanifiée,
        ).estÉgaleÀ(
          GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois,
        ),
      );

      if (
        tâcheÉchoirGarantiesFinancières &&
        !tâcheRappelUnMoisGarantiesFinancières &&
        !tâcheRappelDeuxMoisGarantiesFinancières
      ) {
        /**
         * @todo Ajouter une tâche de rappel un / deux mois  avant l'échéance
         */
      }
    }

    console.info('\nFin du script ✨');
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
