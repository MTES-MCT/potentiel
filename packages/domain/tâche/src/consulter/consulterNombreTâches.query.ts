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
    const nombreTâches = await récupérerNombreTâche(email);
    console.log(nombreTâches);
    return {
      nombreTâches,
    };
  };
  mediator.register('CONSULTER_NOMBRE_TÂCHES_QUERY', handler);
};
