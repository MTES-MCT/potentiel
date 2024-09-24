import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { Candidature } from '@potentiel-domain/candidature';
import { Période } from '@potentiel-domain/periode';
import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/laureat';
import { Éliminé } from '@potentiel-domain/elimine';
import { Where } from '@potentiel-domain/entity';

(async () => {
  try {
    const allPériodes = await executeSelect<{
      appelOffreId: string;
      periodeId: string;
      notifiedOn: number;
      notifiedBy: string | null;
      projets: string[];
    }>(`
        select
          "appelOffreId",
          "periodeId",
          MIN("notifiedBy") as "notifiedBy",
          min("notifiedOn") as "notifiedOn",
        	array_agg(distinct concat("identifiantProjet", ',',"notifiedOn")) as projets
        from
          (
          select
            format('%s#%s#%s#%s',p."appelOffreId",p."periodeId",	p."familleId",p."numeroCRE") as "identifiantProjet",
            p."appelOffreId",
            p."periodeId",
            -- en cas de recours, on se base sur la date originale, présente dans NotifiedOn (si elle existe)
            to_timestamp(case
              when mr.id is not null
              and es.payload is not null then (es.payload ->>'notifiedOn'::text)::decimal
              else p."notifiedOn"::decimal
            end/1000)::date||'T12:00:00.000Z' as "notifiedOn",
            u."email" as "notifiedBy"
          from
              projects p
          left join "eventStores" es on
              es."type" = 'PeriodeNotified'
            and p."appelOffreId" = REPLACE(es.payload->>'appelOffreId','PPE2 - Bâtiment 2','PPE2 - Bâtiment')
            and p."periodeId" = es.payload->>'periodeId'
          left join "modificationRequests" mr on
              mr."type" = 'recours'
            and mr."projectId" = p.id
            and status = 'acceptée'
          left join users u on
            u.id::text = es.payload->>'requestedBy' ) a
        group by
          "appelOffreId",
          "periodeId"
        order by
          "appelOffreId",
          "periodeId"
    `);

    console.info(`Migrating ${allPériodes.length} periodes`);
    for (const { appelOffreId, periodeId, notifiedOn, notifiedBy, projets } of allPériodes) {
      const tousProjets = projets.map((str) => ({
        identifiantProjet: str.split(',')[0] as IdentifiantProjet.RawType,
        notifiéLe: DateTime.convertirEnValueType(new Date(str.split(',')[1])).formatter(),
        statut: undefined as StatutProjet.RawType | undefined,
      }));
      const identifiantPériode = `${appelOffreId}#${periodeId}` as const;
      const candidatures = await listProjection<Candidature.CandidatureEntity>('candidature', {
        where: {
          appelOffre:
            appelOffreId === 'PPE2 - Bâtiment' && periodeId === '2'
              ? Where.include([appelOffreId, 'PPE2 - Bâtiment 2'])
              : Where.equal(appelOffreId),
          période: Where.equal(periodeId),
        },
      });
      tousProjets.forEach((p) => {
        const candidature = candidatures.items.find(
          (x) =>
            x.identifiantProjet.replace('PPE2 - Bâtiment 2', 'PPE2 - Bâtiment') ===
            p.identifiantProjet,
        );
        if (!candidature) {
          throw new Error(`Statut inconnu! ${p.identifiantProjet}. rebuild candidature?`);
        }
        p.statut = candidature.statut;
      });

      const notifiéePar = notifiedBy ?? 'aopv.dgec@developpement-durable.gouv.fr';
      const notifiéeLe = DateTime.convertirEnValueType(new Date(notifiedOn)).formatter();

      const lauréats = tousProjets.filter((item) => item.statut === 'classé');
      const éliminés = tousProjets.filter((item) => item.statut === 'éliminé');

      const event: Période.PériodeNotifiéeEvent = {
        type: 'PériodeNotifiée-V1',
        payload: {
          identifiantPériode,
          appelOffre: appelOffreId,
          période: periodeId,
          notifiéeLe: notifiéeLe,
          notifiéePar,
          identifiantLauréats: lauréats.map(({ identifiantProjet }) => identifiantProjet),
          identifiantÉliminés: éliminés.map(({ identifiantProjet }) => identifiantProjet),
        },
      };

      console.info(
        `Publishing event for periode ${appelOffreId}, ${periodeId}, ${notifiéeLe}, [${notifiéePar}]`,
      );

      await publish(`période|${identifiantPériode}`, event);

      await Promise.all(
        lauréats.map(async ({ identifiantProjet, notifiéLe }) => {
          const event: Lauréat.LauréatNotifiéEvent = {
            type: 'LauréatNotifié-V1',
            payload: {
              identifiantProjet,
              notifiéLe,
              notifiéPar: notifiéePar,
              attestation: {
                format: 'application/pdf',
              },
            },
          };

          await publish(`lauréat|${identifiantProjet}`, event);
        }),
      );
      await Promise.all(
        éliminés.map(async ({ identifiantProjet, notifiéLe }) => {
          const event: Éliminé.ÉliminéNotifiéEvent = {
            type: 'ÉliminéNotifié-V1',
            payload: {
              identifiantProjet,
              notifiéLe,
              notifiéPar: notifiéePar,
              attestation: {
                format: 'application/pdf',
              },
            },
          };

          await publish(`éliminé|${identifiantProjet}`, event);
        }),
      );
    }
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
