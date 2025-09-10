import { Message, MessageHandler, mediator } from 'mediateur';

import { Count, Where } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';

import { TâcheEntity } from '../tâche.entity';
import { GetProjetUtilisateurScope } from '../../..';

export type ConsulterNombreTâchesReadModel = {
  nombreTâches: number;
};

export type ConsulterNombreTâchesQuery = Message<
  'Tâche.Query.ConsulterNombreTâches',
  {
    email: string;
  },
  ConsulterNombreTâchesReadModel
>;

export type ConsulterNombreTâchesQueryDependencies = {
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
  count: Count;
};

export const registerConsulterNombreTâchesQuery = ({
  getScopeProjetUtilisateur,
  count,
}: ConsulterNombreTâchesQueryDependencies) => {
  const handler: MessageHandler<ConsulterNombreTâchesQuery> = async ({ email }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(email));

    if (scope.type === 'projet') {
      const nombreTâches = await count<TâcheEntity>('tâche', {
        where: {
          identifiantProjet: Where.matchAny(scope.identifiantProjets),
        },
      });

      return {
        nombreTâches,
      };
    }

    return { nombreTâches: 0 };
  };
  mediator.register('Tâche.Query.ConsulterNombreTâches', handler);
};
