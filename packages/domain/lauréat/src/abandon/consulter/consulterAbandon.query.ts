import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, QueryPorts } from '@potentiel-domain/common';

import { AbandonReadModel, AbandonReadModelKey } from '../abandon.readmodel';
import { AbandonInconnuErreur } from '../abandonInconnu.error';

export type ConsulterAbandonQuery = Message<
  'CONSULTER_ABANDON',
  {
    identifiantProjet: string;
  },
  AbandonReadModel
>;

export type ConsulterAbandonDependencies = {
  find: QueryPorts.Find;
};

export const registerConsulterAbandonQuery = ({ find }: ConsulterAbandonDependencies) => {
  const handler: MessageHandler<ConsulterAbandonQuery> = async ({ identifiantProjet }) => {
    const key: AbandonReadModelKey = `abandon|${IdentifiantProjet.convertirEnValueType(
      identifiantProjet,
    ).formatter()}`;

    const result = await find<AbandonReadModel>(key);

    if (isNone(result)) {
      throw new AbandonInconnuErreur();
    }

    return result;
  };
  mediator.register('CONSULTER_ABANDON', handler);
};
