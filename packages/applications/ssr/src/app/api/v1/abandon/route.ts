import { bootstrap } from '@/infrastructure/bootstrap';
import { ListerAbandonAvecRecandidatureQuery } from '@potentiel/domain-views';
import { mediator } from 'mediateur';

bootstrap();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = +(searchParams.get('page') || '');
  const itemsPerPage = +(searchParams.get('itemsPerPage') || '');

  if (page && itemsPerPage) {
    const result = await mediator.send<ListerAbandonAvecRecandidatureQuery>({
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
