import { Message, MessageHandler, mediator } from 'mediateur';

import { Count, Where } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';

import { TâcheEntity } from '../tâche.entity.js';
import { GetScopeProjetUtilisateur } from '../../../index.js';

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
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
  count: Count;
};

export const registerConsulterNombreTâchesQuery = ({
  getScopeProjetUtilisateur,
  count,
}: ConsulterNombreTâchesQueryDependencies) => {
  const handler: MessageHandler<ConsulterNombreTâchesQuery> = async ({ email }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(email));

    const nombreTâches = await count<TâcheEntity>('tâche', {
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
      },
    });

    return {
      nombreTâches,
    };
  };
  mediator.register('Tâche.Query.ConsulterNombreTâches', handler);
};
