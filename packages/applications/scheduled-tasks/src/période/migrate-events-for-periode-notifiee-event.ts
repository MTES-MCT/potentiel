import { mediator } from 'mediateur';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { Candidature } from '@potentiel-domain/candidature';
import { Période } from '@potentiel-domain/periode';
import { DateTime } from '@potentiel-domain/common';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Lauréat } from '@potentiel-domain/laureat';
import { Éliminé } from '@potentiel-domain/elimine';

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
            null as "requestedBy"
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

      const notifiéePar = users[0]?.email.trim() ?? 'aopv.dgec@developpement-durable.gouv.fr';
      const notifiéeLe = DateTime.convertirEnValueType(new Date(notifiedOn)).formatter();

      const identifiantLauréats = candidatures.items
        .filter((item) => item.statut.estClassé())
        .map(({ identifiantProjet }) => identifiantProjet.formatter());

      const identifiantÉliminés = candidatures.items
        .filter((item) => item.statut.estÉliminé())
        .map(({ identifiantProjet }) => identifiantProjet.formatter());

      const event: Période.PériodeNotifiéeEvent = {
        type: 'PériodeNotifiée-V1',
        payload: {
          identifiantPériode,
          appelOffre: appelOffreId,
          période: periodeId,
          notifiéeLe: notifiéeLe,
          notifiéePar,
          identifiantLauréats,
          identifiantÉliminés,
        },
      };

      console.info(
        `Publishing event for periode ${appelOffreId}, ${periodeId}, ${notifiéeLe}, [${notifiéePar}]`,
      );

      await publish(`période|${identifiantPériode}`, event);

      await Promise.all(
        identifiantLauréats.map(async (identifiantLauréat) => {
          const event: Lauréat.LauréatNotifiéEvent = {
            type: 'LauréatNotifié-V1',
            payload: {
              identifiantProjet: identifiantLauréat,
              notifiéLe: notifiéeLe,
              notifiéPar: notifiéePar,
              attestation: {
                format: 'application/pdf',
              },
            },
          };

          await publish(`lauréat|${identifiantLauréat}`, event);
        }),
      );
      await Promise.all(
        identifiantÉliminés.map(async (identifiantÉliminé) => {
          const event: Éliminé.ÉliminéNotifiéEvent = {
            type: 'ÉliminéNotifié-V1',
            payload: {
              identifiantProjet: identifiantÉliminé,
              notifiéLe: notifiéeLe,
              notifiéPar: notifiéePar,
              attestation: {
                format: 'application/pdf',
              },
            },
          };

          await publish(`éliminé|${identifiantÉliminé}`, event);
        }),
      );
    }
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
