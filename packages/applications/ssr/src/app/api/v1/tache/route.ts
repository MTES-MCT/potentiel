import { OperationRejectedError } from '@potentiel-domain/core';
import { ConsulterNombreTâchesQuery } from '@potentiel-domain/tache';
import { mediator } from 'mediateur';

import { apiAction } from '@/utils/apiAction';
import { getUser } from '@/utils/getUtilisateur';

export const dynamic = 'force-dynamic';

export const GET = () =>
  apiAction(async () => {
    const utilisateur = await getUser();

    if (utilisateur) {
      const result = await mediator.send<ConsulterNombreTâchesQuery>({
        type: 'CONSULTER_NOMBRE_TÂCHES_QUERY',
        data: {
          email: utilisateur.email,
        },
      });
      return Response.json(result);
    }

    throw new OperationRejectedError('Utilisateur non connecté');
  });
