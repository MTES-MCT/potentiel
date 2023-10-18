import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel/monads';
import { AbandonReadModel } from '../abandon.readmodel';
import { Find } from '../../../common/common.port';
import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '../../../common/projet.valueType';

export type ConsulterAbandonQuery = Message<
  'CONSULTER_ABANDON',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<AbandonReadModel>
>;

export type ConsulterAbandonDependencies = {
  find: Find;
};

export const registerConsulterAbandonQuery = ({ find }: ConsulterAbandonDependencies) => {
  const handler: MessageHandler<ConsulterAbandonQuery> = async ({ identifiantProjet }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    return await find<AbandonReadModel>(`abandon|${rawIdentifiantProjet}`);
  };
  mediator.register('CONSULTER_ABANDON', handler);
};
