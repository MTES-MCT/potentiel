import { mediator } from 'mediateur';

import {
  ListerTâchesPlanifiéesReadModel,
  ListerTâchesPlanifiéesQuery,
  registerTâchePlanifiéeQuery,
  registerTâchePlanifiéeUseCases,
  AjouterTâchePlanifiéeCommand,
} from '@potentiel-domain/tache-planifiee';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat/';

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

    type Statistics = Array<{
      identifiantProjet: IdentifiantProjet.RawType;
      tâchesAjoutées: Array<GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.RawType>;
    }>;
    const statistics: Statistics = [];

    for (const [identifiantProjet, tâches] of Object.entries(tâchesParProjet)) {
      const tâcheÉchoir = tâches.find((t) =>
        GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.convertirEnValueType(
          t.typeTâchePlanifiée,
        ).estÉchoir(),
      );

      if (!tâcheÉchoir) {
        continue;
      }

      const tâcheRappelUnMois = tâches.find((t) =>
        GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.convertirEnValueType(
          t.typeTâchePlanifiée,
        ).estRappelÉchéanceUnMois(),
      );

      const tâcheRappelDeuxMois = tâches.find((t) =>
        GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.convertirEnValueType(
          t.typeTâchePlanifiée,
        ).estRappelÉchéanceDeuxMois(),
      );

      if (tâcheRappelUnMois && tâcheRappelDeuxMois) {
        continue;
      }

      const tâchesÀAjouter: AjouterTâchePlanifiéeCommand['data']['tâches'] = [];

      if (!tâcheRappelUnMois) {
        console.log(
          `Projet ${identifiantProjet} - Ajout de la tâche de rappel un mois avant échéance`,
        );
        tâchesÀAjouter.push({
          typeTâchePlanifiée:
            GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois.type,
          àExécuterLe: tâcheÉchoir.àExécuterLe.retirerNombreDeMois(1),
        });
      }

      if (!tâcheRappelDeuxMois) {
        console.log(
          `Projet ${identifiantProjet} - Ajout de la tâche de rappel deux mois avant échéance`,
        );
        tâchesÀAjouter.push({
          typeTâchePlanifiée:
            GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois.type,
          àExécuterLe: tâcheÉchoir.àExécuterLe.retirerNombreDeMois(2),
        });
      }

      await mediator.send<AjouterTâchePlanifiéeCommand>({
        type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
        data: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
          tâches: tâchesÀAjouter,
        },
      });

      statistics.push({
        identifiantProjet: identifiantProjet as IdentifiantProjet.RawType,
        tâchesAjoutées: tâchesÀAjouter.map(
          (t) =>
            GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.convertirEnValueType(
              t.typeTâchePlanifiée,
            ).type,
        ),
      });
    }

    console.info('\nStatistiques:');
    console.info(`\nNombre de projets concernés: ${statistics.length}`);
    console.info(
      `\nNombre de tâches ajoutées: ${statistics.reduce((acc, s) => acc + s.tâchesAjoutées.length, 0)}`,
    );

    console.info('\nFin du script ✨');
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
