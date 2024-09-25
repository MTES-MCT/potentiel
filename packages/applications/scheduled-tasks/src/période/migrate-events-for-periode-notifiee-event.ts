import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { Période } from '@potentiel-domain/periode';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/laureat';
import { Éliminé } from '@potentiel-domain/elimine';

(async () => {
  try {
    const allPériodes = await executeSelect<{
      appelOffreId: string;
      periodeId: string;
      notifiedOn: number;
      projets: {
        identifiantProjet: IdentifiantProjet.RawType;
        notifiedOn: string;
        statut: string;
      }[];
    }>(`
        select
          REPLACE(p."appelOffreId",'PPE2 - Bâtiment 2','PPE2 - Bâtiment') as "appelOffreId",
          p."periodeId",		
          to_timestamp(min("notifiedOn")/1000)::date||'T12:00:00.000Z' as "notifiedOn",
          array_agg(
            json_build_object(
              'identifiantProjet',format('%s#%s#%s#%s',REPLACE(p."appelOffreId",'PPE2 - Bâtiment 2','PPE2 - Bâtiment'), p."periodeId", p."familleId",p."numeroCRE"),
              'notifiedOn',to_timestamp("notifiedOn"/1000)::date||'T12:00:00.000Z',
              'statut', "classe"
          )) as projets
        from projects p 
        group by
          "appelOffreId",
          "periodeId"
        order by
          "appelOffreId",
          "periodeId"
    `);

    const notifiersList = await executeSelect<{
      appelOffreId: string;
      periodeId: string;
      notifiedBy: string;
    }>(`
      select payload->>'appelOffreId' as "appelOffreId",payload->>'periodeId' as "periodeId", min(u.email) as "notifiedBy" 
      from "eventStores" es 
      inner join users u on u.id::text=payload->>'requestedBy'
      where es."type" ='PeriodeNotified'
      group  by payload->>'appelOffreId',payload->>'periodeId';
    `);

    console.info(`Migrating ${allPériodes.length} periodes`);
    for (const { appelOffreId, periodeId, notifiedOn, projets } of allPériodes) {
      const tousProjets = projets.map(({ identifiantProjet, statut, notifiedOn }) => ({
        identifiantProjet,
        notifiéLe: DateTime.convertirEnValueType(notifiedOn).formatter(),
        statut: statut === 'Classé' ? 'classé' : 'éliminé',
      }));

      const identifiantPériode = `${appelOffreId}#${periodeId}` as const;
      const notifiéePar =
        notifiersList.find((n) => n.appelOffreId === appelOffreId && n.periodeId === periodeId)
          ?.notifiedBy ?? 'aopv.dgec@developpement-durable.gouv.fr';

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
