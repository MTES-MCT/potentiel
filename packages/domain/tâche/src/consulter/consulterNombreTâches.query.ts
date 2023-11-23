import { Message, MessageHandler, mediator } from 'mediateur';

export type ConsulterNombreTâchesReadModel = {
  nombreTâches: number;
};

export type ConsulterNombreTâchesQuery = Message<
  'CONSULTER_NOMBRE_TÂCHES_QUERY',
  {
    identifiantProjetValue: string;
  },
  ConsulterNombreTâchesReadModel
>;

export const registerConsulterNombreTâchesQuery = () => {
  const handler: MessageHandler<ConsulterNombreTâchesQuery> = async () => {
    return {
      nombreTâches: 0,
    };
  };
  mediator.register('CONSULTER_NOMBRE_TÂCHES_QUERY', handler);
};
