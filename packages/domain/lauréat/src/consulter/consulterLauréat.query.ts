import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatEntity } from '../lauréat.entity';

export type ConsulterLauréatReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
};

export type ConsulterLauréatQuery = Message<
  'Lauréat.Query.ConsulterLauréat',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterLauréatReadModel>
>;

export type ConsulterLauréatDependencies = {
  find: Find;
};

export const registerConsulterLauréatQuery = ({ find }: ConsulterLauréatDependencies) => {
  const handler: MessageHandler<ConsulterLauréatQuery> = async ({ identifiantProjet }) => {
    const lauréat = await find<LauréatEntity>(`lauréat|${identifiantProjet}`);

    if (Option.isNone(lauréat)) {
      return lauréat;
    }

    return mapToReadModel(lauréat);
  };
  mediator.register('Lauréat.Query.ConsulterLauréat', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  notifiéLe,
  notifiéPar,
}: LauréatEntity): ConsulterLauréatReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  notifiéLe: DateTime.convertirEnValueType(notifiéLe),
  notifiéPar: Email.convertirEnValueType(notifiéPar),
});
