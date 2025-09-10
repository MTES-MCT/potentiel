import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const dynamic = 'force-dynamic';

export const GET = () =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const result = await mediator.send<Lauréat.Tâche.ListerTâchesQuery>({
        type: 'Tâche.Query.ListerTâches',
        data: {
          email: utilisateur.identifiantUtilisateur.email,
        },
      });
      return Response.json(result.total);
    }),
  );
