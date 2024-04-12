import { Message, MessageHandler, mediator } from 'mediateur';

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

export type RécupérerNombreTâchePort = (email: string) => Promise<number>;

export type ConsulterNombreTâchesQueryDependencies = {
  récupérerNombreTâche: RécupérerNombreTâchePort;
};

export const registerConsulterNombreTâchesQuery = ({
  récupérerNombreTâche,
}: ConsulterNombreTâchesQueryDependencies) => {
  const handler: MessageHandler<ConsulterNombreTâchesQuery> = async ({ email }) => {
    const nombreTâches = await récupérerNombreTâche(email);
    return {
      nombreTâches,
    };
  };
  mediator.register('Tâche.Query.ConsulterNombreTâches', handler);
};
