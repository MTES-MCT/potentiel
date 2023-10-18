import { bootstrap } from '@/infrastructure/bootstrap';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { ConsulterAbandonQuery } from '@potentiel-domain/laureat';
import { isSome } from '@potentiel/monads';
import { mediator } from 'mediateur';

bootstrap();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (IdentifiantProjet.estUnRawType(params.id)) {
    const result = await mediator.send<ConsulterAbandonQuery>({
      type: 'CONSULTER_ABANDON',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(params.id),
      },
    });

    if (isSome(result)) {
      return Response.json(result);
    } else {
      return Response.json(
        {
          message: 'Aucun abandon trouvé pour ce projet',
        },
        {
          status: 404,
          statusText: 'Not Found',
        },
      );
    }
  } else {
    return Response.json(
      { message: 'Identifiant projet invalide' },
      {
        status: 400,
        statusText: 'Bad Request',
      },
    );
  }
}
