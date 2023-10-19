import { mediator } from 'mediateur';

import { bootstrap } from '@/infrastructure/bootstrap';
import { executeAction } from '@/utils/executeAction';
import { getPagination } from '@/utils/getPagination';

import { ListerAbandonsQuery } from '@potentiel-domain/laureat';

bootstrap();

export const GET = (request: Request) =>
  executeAction(async () => {
    const result = await mediator.send<ListerAbandonsQuery>({
      type: 'LISTER_ABANDONS_QUERY',
      data: {
        recandidature: true,
        pagination: getPagination(request),
      },
    });

    return Response.json(result);
  });
