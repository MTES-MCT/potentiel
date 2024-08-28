import { Message, MessageHandler, mediator } from 'mediateur';

import { Count } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteur } from '@potentiel-domain/utilisateur';

import { TâcheEntity } from '../tâche.entity';

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
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
  count: Count;
};

export const registerConsulterNombreTâchesQuery = ({
  récupérerIdentifiantsProjetParEmailPorteur,
  count,
}: ConsulterNombreTâchesQueryDependencies) => {
  const handler: MessageHandler<ConsulterNombreTâchesQuery> = async ({ email }) => {
    const identifiants = await récupérerIdentifiantsProjetParEmailPorteur(email);

    const nombreTâches = await count<TâcheEntity>('tâche', {
      where: {
        identifiantProjet: {
          operator: 'include',
          value: identifiants,
        },
      },
    });

    return {
      nombreTâches,
    };
  };
  mediator.register('Tâche.Query.ConsulterNombreTâches', handler);
};
