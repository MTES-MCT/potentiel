import { mediator } from 'mediateur';

import { apiAction } from '@/utils/apiAction';
import { getPagination } from '@/utils/getPagination';

import { Abandon } from '@potentiel-domain/laureat';

export const GET = (request: Request) =>
  apiAction(async () => {
    const result = await mediator.send<Abandon.ListerAbandonsQuery>({
      type: 'LISTER_ABANDONS_QUERY',
      data: {
        pagination: getPagination(request),
      },
    });

    return Response.json(result);
  });
