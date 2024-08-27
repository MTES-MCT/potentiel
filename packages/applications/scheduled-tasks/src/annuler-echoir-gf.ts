import { mediator } from 'mediateur';

import {
  AnnulerTâchePlanifiéeCommand,
  ListerTâchesPlanifiéesQuery,
  registerTâchePlanifiéeQuery,
  registerTâchePlanifiéeUseCases,
} from '@potentiel-domain/tache-planifiee';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature } from '@potentiel-domain/candidature';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Option } from '@potentiel-libraries/monads';
import { Abandon } from '@potentiel-domain/laureat';

registerTâchePlanifiéeUseCases({
  loadAggregate,
});

registerTâchePlanifiéeQuery({
  list: listProjection,
});

Candidature.registerCandidatureQueries({
  find: findProjection,
  récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
  récupérerProjetsEligiblesPreuveRecanditure:
    CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
  récupérerProjets: CandidatureAdapter.récupérerProjetsAdapter,
  list: listProjection,
});

Abandon.registerAbandonQueries({
  find: findProjection,
  list: listProjection,
  récupérerIdentifiantsProjetParEmailPorteur: async () => [],
});

(async () => {
  try {
    const tâchesPlanifiées = await mediator.send<ListerTâchesPlanifiéesQuery>({
      type: 'Tâche.Query.ListerTâchesPlanifiées',
      data: { catégorieTâche: 'garanties-financières' },
    });

    console.info(`🧐 ${tâchesPlanifiées.total} tâches found`);

    let tâchesAnnulées = 0;

    for (const { identifiantProjet, typeTâchePlanifiée } of tâchesPlanifiées.items) {
      const projet = await mediator.send<Candidature.ConsulterProjetQuery>({
        type: 'Candidature.Query.ConsulterProjet',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });
      if (Option.isNone(projet)) {
        console.warn(`❌ Projet ${identifiantProjet.formatter()} non trouvé`);
        continue;
      }
      if (projet.statut === 'classé') {
        const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
          type: 'Lauréat.Abandon.Query.ConsulterAbandon',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });
        if (Option.isNone(abandon) || !abandon.statut.estConfirmé()) {
          console.info(`🤫 Skipping project ${identifiantProjet.formatter()}...`);

          continue;
        }
      }
      console.info(`📨 Publishing event for project ${identifiantProjet.formatter()}...`);

      await mediator.send<AnnulerTâchePlanifiéeCommand>({
        type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
        data: {
          identifiantProjet,
          typeTâchePlanifiée,
        },
      });
      tâchesAnnulées++;
    }

    console.log(`🚀 ${tâchesAnnulées} tâches annulées`);

    console.info('\nFin du script ✨');
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
