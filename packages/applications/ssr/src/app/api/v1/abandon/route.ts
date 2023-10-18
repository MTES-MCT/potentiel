import { mediator } from 'mediateur';
import { ListerAbandonsQuery } from '@potentiel-domain/laureat';
import { bootstrap } from '@/infrastructure/bootstrap';

bootstrap();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = +(searchParams.get('page') || '');
  const itemsPerPage = +(searchParams.get('itemsPerPage') || '');

  if (page && itemsPerPage) {
    const result = await mediator.send<ListerAbandonsQuery>({
      type: 'LISTER_ABANDONS_QUERY',
      data: {
        recandidature: true,
        pagination: {
          itemsPerPage,
          page,
        },
      },
    });

    return Response.json(result);
  }
}
