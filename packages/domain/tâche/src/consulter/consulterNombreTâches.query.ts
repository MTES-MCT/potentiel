import { type Message, type MessageHandler, mediator } from 'mediateur';

import { type Count, Where } from '@potentiel-domain/entity';
import type { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';

import type { TâcheEntity } from '../tâche.entity';

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
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
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
        identifiantProjet: Where.matchAny(identifiants),
      },
    });

    return {
      nombreTâches,
    };
  };
  mediator.register('Tâche.Query.ConsulterNombreTâches', handler);
};
