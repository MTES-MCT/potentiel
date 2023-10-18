import { mediator } from 'mediateur';
import { ListerAbandonsQuery } from '@potentiel-domain/laureat';
import { bootstrap } from '@/infrastructure/bootstrap';
import { executeAction } from '@/utils/executeAction';

bootstrap();

export const GET = (request: Request) =>
  executeAction(async () => {
    const { searchParams } = new URL(request.url);
    const page = +(searchParams.get('page') || '');
    const itemsPerPage = +(searchParams.get('itemsPerPage') || '');

    if (!page || !itemsPerPage) {
      throw new Error('Invalid operation');
    }

    return mediator.send<ListerAbandonsQuery>({
      type: 'LISTER_ABANDONS_QUERY',
      data: {
        recandidature: true,
        pagination: {
          itemsPerPage,
          page,
        },
      },
    });
  });
