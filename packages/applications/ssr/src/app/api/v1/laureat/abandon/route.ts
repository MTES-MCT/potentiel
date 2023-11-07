import { mediator } from 'mediateur';

import { apiAction } from '@/utils/apiAction';
import { getPagination } from '@/utils/getPagination';

import { Abandon } from '@potentiel-domain/laureat';
import { ConsulterCandidatureLegacyQuery } from '@potentiel/domain-views';
import { isSome } from '@potentiel/monads';

export const GET = (request: Request) =>
  apiAction(async () => {
    const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
      type: 'LISTER_ABANDONS_QUERY',
      data: {
        pagination: getPagination(request),
      },
    });

    const result = await Promise.all(
      abandons.items.map(async (a) => {
        const projet = await mediator.send<ConsulterCandidatureLegacyQuery>({
          type: 'CONSULTER_CANDIDATURE_LEGACY_QUERY',
          data: {
            identifiantProjet: a.identifiantProjet,
          },
        });

        return {
          ...a,
          projet: isSome(projet) ? projet : undefined,
        };
      }),
    );

    return Response.json(result);
  });
