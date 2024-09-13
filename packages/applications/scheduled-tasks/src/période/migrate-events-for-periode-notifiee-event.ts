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

      const identifiantPériode = `${appelOffreId}#${periodeId}` as const;

      const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
        type: 'Candidature.Query.ListerCandidatures',
        data: {
          appelOffre: appelOffreId,
          période: periodeId,
        },
      });

      const event: Période.PériodeNotifiéeEvent = {
        type: 'PériodeNotifiée-V1',
        payload: {
          identifiantPériode,
          appelOffre: appelOffreId,
          période: periodeId,
          notifiéeLe: DateTime.convertirEnValueType(new Date(notifiedOn)).formatter(),
          notifiéePar: users[0]?.value.email ?? 'unknown@unknown.unknowm',
          identifiantLauréats: candidatures.items
            .filter((item) => item.statut.estClassé())
            .map(({ identifiantProjet }) => identifiantProjet.formatter()),
          identifiantÉliminés: candidatures.items
            .filter((item) => item.statut.estÉliminé())
            .map(({ identifiantProjet }) => identifiantProjet.formatter()),
        },
      };

      await publish(`période|${identifiantPériode}`, event);
    }
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
