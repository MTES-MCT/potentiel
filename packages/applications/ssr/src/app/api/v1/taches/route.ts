import { apiAction } from '@/utils/apiAction';
import { mediator } from 'mediateur';
import { ConsulterNombreTâchesQuery } from '@potentiel-domain/tache';
import { OperationRejectedError } from '@potentiel-domain/core';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const dynamic = 'force-dynamic';

export const GET = () =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
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
    }),
  );
