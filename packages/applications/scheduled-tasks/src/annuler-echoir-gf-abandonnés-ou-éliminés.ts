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
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';

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

    let tâchesAnnulées = 0;

    const projetIds = new Set<IdentifiantProjet.RawType>();

    for (const { identifiantProjet, typeTâchePlanifiée } of tâchesPlanifiées.items) {
      const projet = await mediator.send<Candidature.ConsulterProjetQuery>({
        type: 'Candidature.Query.ConsulterProjet',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });
      if (Option.isNone(projet)) {
        console.warn(`❌ Projet ${identifiantProjet} non trouvé`);
        continue;
      }

      const statutProjet = StatutProjet.convertirEnValueType(projet.statut);

      if (statutProjet.estClassé()) {
        continue;
      }

      projetIds.add(identifiantProjet.formatter());

      await mediator.send<AnnulerTâchePlanifiéeCommand>({
        type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
        data: {
          identifiantProjet,
          typeTâchePlanifiée,
        },
      });
      console.log(`📨 Tâche échoir annulée pour le projet ${identifiantProjet.formatter()}`);
      tâchesAnnulées++;
    }

    console.log(`\n📊 Statistiques`);
    console.log(`\n${projetIds.size} projets concernés`);
    console.log(`\n${tâchesPlanifiées.items.length} tâches échoir trouvées pour : `);
    console.log(`\n🥁 ${tâchesAnnulées} tâches annulées`);

    console.info('\nFin du script ✨');
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
