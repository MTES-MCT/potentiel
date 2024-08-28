import { Message, MessageHandler, mediator } from 'mediateur';

import { Find } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { PériodeEntity } from '../période.entity';

export type ConsulterPériodeReadModel = Omit<PériodeEntity, 'type'>;

export type ConsulterPériodeQuery = Message<
  'Période.Query.ConsulterPériode',
  {
    identifiantPériode: string;
  },
  Option.Type<ConsulterPériodeReadModel>
>;

export type ConsulterPériodeDependencies = {
  find: Find;
};

export const registerConsulterPériodeQuery = ({ find }: ConsulterPériodeDependencies) => {
  const handler: MessageHandler<ConsulterPériodeQuery> = async ({ identifiantPériode }) => {
    const result = await find<PériodeEntity>(`période|${identifiantPériode}`);

    return result;
  };

  mediator.register('Période.Query.ConsulterPériode', handler);
};
