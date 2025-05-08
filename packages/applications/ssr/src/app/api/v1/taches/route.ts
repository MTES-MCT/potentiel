import { mediator } from 'mediateur';

import { Tâche } from '@potentiel-domain/tache';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const dynamic = 'force-dynamic';

export const GET = () =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const result = await mediator.send<Tâche.ConsulterNombreTâchesQuery>({
        type: 'Tâche.Query.ConsulterNombreTâches',
        data: {
          email: utilisateur.identifiantUtilisateur.email,
        },
      });
      return Response.json(result);
    }),
  );
