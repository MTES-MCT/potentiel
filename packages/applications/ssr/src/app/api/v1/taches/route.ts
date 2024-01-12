import { apiAction } from '@/utils/apiAction';
import { mediator } from 'mediateur';
import { ConsulterNombreTâchesQuery } from '@potentiel-domain/tache';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const dynamic = 'force-dynamic';

export const GET = () =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const result = await mediator.send<ConsulterNombreTâchesQuery>({
        type: 'CONSULTER_NOMBRE_TÂCHES_QUERY',
        data: {
          email: utilisateur.identifiantUtilisateur.email,
        },
      });
      return Response.json(result);
    }),
  );
