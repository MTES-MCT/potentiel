import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel/monads';
import { AbandonReadModel, AbandonReadModelKey } from '../abandon.readmodel';

import { IdentifiantProjet, QueryPorts } from '@potentiel-domain/common';

export type ConsulterAbandonQuery = Message<
  'CONSULTER_ABANDON',
  {
    identifiantProjet: IdentifiantProjet.RawType | IdentifiantProjet.PlainType;
  },
  Option<AbandonReadModel>
>;

export type ConsulterAbandonDependencies = {
  find: QueryPorts.Find;
};

export const registerConsulterAbandonQuery = ({ find }: ConsulterAbandonDependencies) => {
  const handler: MessageHandler<ConsulterAbandonQuery> = async ({ identifiantProjet }) => {
    const key: AbandonReadModelKey = `abandon|${IdentifiantProjet.convertirEnValueType(
      identifiantProjet,
    ).formatter()}`;

    return await find<AbandonReadModel>(key);
  };
  mediator.register('CONSULTER_ABANDON', handler);
};
