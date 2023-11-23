import { Message, MessageHandler, mediator } from 'mediateur';

export type ConsulterNombreTâchesReadModel = {
  nombreTâches: number;
};

export type ConsulterNombreTâchesQuery = Message<
  'CONSULTER_NOMBRE_TÂCHES_QUERY',
  {
    email: string;
  },
  ConsulterNombreTâchesReadModel
>;

export type RécupérerNombreTâchePort = (email: string) => Promise<number>;

export type ConsulterNombreTâchesQueryDependencies = {
  récupérerNombreTâche: RécupérerNombreTâchePort;
};

export const registerConsulterNombreTâchesQuery = ({
  récupérerNombreTâche,
}: ConsulterNombreTâchesQueryDependencies) => {
  const handler: MessageHandler<ConsulterNombreTâchesQuery> = async ({ email }) => {
    return {
      nombreTâches: await récupérerNombreTâche(email),
    };
  };
  mediator.register('CONSULTER_NOMBRE_TÂCHES_QUERY', handler);
};
