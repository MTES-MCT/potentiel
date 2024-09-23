import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { Candidature } from '@potentiel-domain/candidature';
import { Période } from '@potentiel-domain/periode';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
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
      identifiants: IdentifiantProjet.RawType[];
    }>(`
        select
          case
            when p."appelOffreId" = 'PPE2 - Bâtiment 2' then 'PPE2 - Bâtiment'
            else p."appelOffreId"
          end as "appelOffreId",
          p."periodeId",
          p."notifiedOn",
          u."email" as "notifiedBy",
          array_agg(format('%s#%s#%s#%s',	REPLACE(p."appelOffreId",'PPE2 - Bâtiment 2', 'PPE2 - Bâtiment'),p."periodeId",p."familleId",p."numeroCRE")) as identifiants
        from
          projects p
        left join "eventStores" es on
          es."type" = 'PeriodeNotified'
          and p."appelOffreId" = es.payload->>'appelOffreId'
          and p."periodeId" = es.payload->>'periodeId'
        left join users u on
          u.id::text = es.payload->>'requestedBy'
        group by
          p."appelOffreId",
          p."periodeId",
          p."notifiedOn",
          u."email" ;
    `);

    console.info(`Migrating ${allPériodes.length} periodes`);

    for (const { appelOffreId, periodeId, notifiedOn, notifiedBy, identifiants } of allPériodes) {
      const identifiantPériode = `${appelOffreId}#${periodeId}` as const;

      const candidatures = await listProjection<Candidature.CandidatureEntity>('candidature', {
        where: {
          identifiantProjet: Where.include(identifiants),
          appelOffre: Where.equal(appelOffreId),
          période: Where.equal(periodeId),
        },
      });

      const notifiéePar = notifiedBy ?? 'aopv.dgec@developpement-durable.gouv.fr';
      const notifiéeLe = DateTime.convertirEnValueType(new Date(notifiedOn)).formatter();

      const identifiantLauréats = candidatures.items
        .filter((item) => item.statut === 'classé')
        .map(({ identifiantProjet }) => identifiantProjet);

      const identifiantÉliminés = candidatures.items
        .filter((item) => item.statut === 'éliminé')
        .map(({ identifiantProjet }) => identifiantProjet);

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
