import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { Période } from '@potentiel-domain/periode';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

(async () => {
  try {
    // TODO
    const périodes = await executeSelect<{
      value: {
        appelOffreId: string;
        periodeId: string;
        notifiedOn: number;
        requestedBy: string;
      };
    }>(`
        select json_build_object(
          'appelOffreId', es.payload->>'appelOffreId',
          'periodeId', es.payload->>'periodeId',
          'notifiedOn', es.payload->'notifiedOn',
          'requestedBy', es.payload->>'requestedBy'
          ) as value
        from "eventStores" es 
        where es."type" = 'PeriodeNotified';
    `);

    for (const {
      value: { appelOffreId, periodeId, notifiedOn, requestedBy },
    } of périodes) {
      const users = await executeSelect<{
        value: {
          email: string;
        };
      }>(
        `
        select json_build_object(
            'email', u."email"
        ) as value
        from "users" u 
        where u."id" = $1;
        `,
        requestedBy,
      );

      const projects = await executeSelect<{
        value: {
          appelOffre: string;
          période: string;
          famille: string;
          numéroCRE: string;
          statut: 'Classé' | 'Eliminé';
        };
      }>(
        `
        select json_build_object(
            'appelOffre', es.payload->>'appelOffreId',
            'période', es.payload->>'periodeId',
            'famille', es.payload->>'familleId',
            'numéroCRE', es.payload->>'numeroCRE',
            'statut', es.payload->'data'->>'classe'
        ) as value
        from "eventStores" es 
        where es."type" = 'ProjectImported'
        and es.payload->>'appelOffreId' = $1
        and es.payload->>'periodeId' = $2;
        `,
        appelOffreId,
        periodeId,
      );

      const identifiantPériode = `${appelOffreId}#${periodeId}` as const;

      const event: Période.PériodeNotifiéeEvent = {
        type: 'PériodeNotifiée-V1',
        payload: {
          identifiantPériode,
          appelOffre: appelOffreId,
          période: periodeId,
          notifiéeLe: DateTime.convertirEnValueType(new Date(notifiedOn)).formatter(),
          notifiéePar: users[0]?.value.email ?? 'unknown@unknown.unknowm',
          identifiantLauréats: projects
            .filter((p) => p.value.statut === 'Classé')
            .map(
              ({ value: { appelOffre, période, famille, numéroCRE } }) =>
                `${appelOffre}#${période}#${famille}#${numéroCRE}` as const,
            ),
          identifiantÉliminés: projects
            .filter((p) => p.value.statut === 'Eliminé')
            .map(({ value: { appelOffre, période, famille, numéroCRE } }) =>
              IdentifiantProjet.convertirEnValueType(
                `${appelOffre}#${période}#${famille}#${numéroCRE}`,
              ).formatter(),
            ),
        },
      };

      await publish(`période|${identifiantPériode}`, event);
    }
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
