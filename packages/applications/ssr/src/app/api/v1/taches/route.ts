import { apiAction } from '@/utils/apiAction';
import { mediator } from 'mediateur';
import { ConsulterNombreTâchesQuery } from '@potentiel-domain/tache';
import { OperationRejectedError } from '@potentiel-domain/core';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { GetAccessTokenMessage } from '@/bootstrap/getAccessToken.handler';

export const dynamic = 'force-dynamic';

export const GET = () =>
  apiAction(async () => {
    const accessToken = await mediator.send<GetAccessTokenMessage>({
      type: 'GET_ACCESS_TOKEN',
      data: {},
    });
    const utilisateur = Utilisateur.convertirEnValueType(accessToken);

    if (utilisateur) {
      const result = await mediator.send<ConsulterNombreTâchesQuery>({
        type: 'CONSULTER_NOMBRE_TÂCHES_QUERY',
        data: {
          email: utilisateur.identifiantUtilisateur.email,
        },
      });
      return Response.json(result);
    }

    throw new OperationRejectedError('Utilisateur non connecté');
  });
