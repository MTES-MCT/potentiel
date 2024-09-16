import { mediator } from 'mediateur';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { Candidature } from '@potentiel-domain/candidature';
import { Période } from '@potentiel-domain/periode';
import { DateTime } from '@potentiel-domain/common';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

Candidature.registerCandidatureQueries({
  find: findProjection,
  récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
  récupérerProjetsEligiblesPreuveRecanditure:
    CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
  récupérerProjets: CandidatureAdapter.récupérerProjetsAdapter,
  list: listProjection,
});

(async () => {
  try {
    // TODO
    const périodes = await executeSelect<{
      appelOffreId: string;
      periodeId: string;
      notifiedOn: number;
      requestedBy: string;
    }>(`
        select es.payload->>'appelOffreId' as "appelOffreId",
              es.payload->>'periodeId' as "periodeId",
              es.payload->'notifiedOn' as "notifiedOn",
              es.payload->>'requestedBy' as "requestedBy"
        from "eventStores" es 
        where es."type" = 'PeriodeNotified'
        order by es.payload->>'notifiedOn' asc;
    `);

    const legacyPeriodes = await executeSelect<{
      appelOffreId: string;
      periodeId: string;
      notifiedOn: number;
      requestedBy: string;
    }>(`
        select distinct on (p."appelOffreId", p."periodeId") 
            case 
              when p."appelOffreId" = 'PPE2 - Bâtiment 2' then 'PPE2 - Bâtiment'
              else p."appelOffreId"
            end as "appelOffreId",
            p."periodeId", 
            p."notifiedOn", 
              'c520e2c5-74ad-47e6-a417-5a8020999a14' as "requestedBy"
        from projects p 
        left join "eventStores" es on es."type" = 'PeriodeNotified'
                      and p."appelOffreId" = es.payload->>'appelOffreId'  
                      and p."periodeId" = es.payload->>'periodeId'
        where es.id is null
        group by p."appelOffreId", 
            p."periodeId", 
            p."notifiedOn" 
        order by p."appelOffreId", 
            p."periodeId", 
            p."notifiedOn";
    `);

    const allPériodes = périodes.concat(legacyPeriodes);

    console.info(`Migrating ${allPériodes.length} periodes`);

    for (const { appelOffreId, periodeId, notifiedOn, requestedBy } of allPériodes) {
      const users = await executeSelect<{
        email: string;
      }>(
        `
        select email
        from "users"
        where id = $1;
        `,
        requestedBy,
      );

      const identifiantPériode = `${appelOffreId}#${periodeId}` as const;

      const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
        type: 'Candidature.Query.ListerCandidatures',
        data: {
          appelOffre: appelOffreId,
          période: periodeId,
        },
      });

      const notifiéePar = users[0]?.email.trim() ?? 'ghislain.ferran@developpement-durable.gouv.fr';
      const notifiéeLe = DateTime.convertirEnValueType(new Date(notifiedOn)).formatter();

      const event: Période.PériodeNotifiéeEvent = {
        type: 'PériodeNotifiée-V1',
        payload: {
          identifiantPériode,
          appelOffre: appelOffreId,
          période: periodeId,
          notifiéeLe: notifiéeLe,
          notifiéePar,
          identifiantLauréats: candidatures.items
            .filter((item) => item.statut.estClassé())
            .map(({ identifiantProjet }) => identifiantProjet.formatter()),
          identifiantÉliminés: candidatures.items
            .filter((item) => item.statut.estÉliminé())
            .map(({ identifiantProjet }) => identifiantProjet.formatter()),
        },
      };

      console.info(
        `Publishing event for periode ${appelOffreId}, ${periodeId}, ${notifiéeLe}, [${notifiéePar}]`,
      );

      await publish(`période|${identifiantPériode}`, event);
    }
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
