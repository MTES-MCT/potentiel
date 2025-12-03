import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const dynamic = 'force-dynamic';

/** @@deprecated uniquement pour utilisation dans le legacy */
export const GET = () =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const result = await mediator.send<Lauréat.Tâche.ConsulterNombreTâchesQuery>({
        type: 'Tâche.Query.ConsulterNombreTâches',
        data: {
          email: utilisateur.identifiantUtilisateur.email,
        },
      });
      return Response.json(result);
    }),
  );
