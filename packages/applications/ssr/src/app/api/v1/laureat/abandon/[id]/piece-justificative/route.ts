import { bootstrap } from '@/infrastructure/bootstrap';
import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  ConsulterPièceJustificativeAbandonProjetQuery,
} from '@potentiel-domain/laureat';
import { isSome } from '@potentiel/monads';
import { mediator } from 'mediateur';

bootstrap();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (IdentifiantProjet.estUnRawType(params.id)) {
    const result = await mediator.send<ConsulterPièceJustificativeAbandonProjetQuery>({
      type: 'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(params.id),
      },
    });

    if (isSome(result)) {
      return new Response(result.content, {
        headers: {
          'content-type': result.format,
        },
      });
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
