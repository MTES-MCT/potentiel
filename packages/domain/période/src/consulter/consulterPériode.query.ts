import { Message, MessageHandler, mediator } from 'mediateur';

import { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantPériode, PériodeEntity } from '../période';
import { Période } from '..';

export type ConsulterPériodeReadModel = PériodeNotifiée | PériodeNonNotifiée;

type PériodeNonNotifiée = {
  identifiantPériode: IdentifiantPériode.ValueType;
  estNotifiée: false;
};

type PériodeNotifiée = {
  identifiantPériode: IdentifiantPériode.ValueType;
  estNotifiée: true;

  notifiéeLe: DateTime.ValueType;
  notifiéePar: Email.ValueType;

  identifiantLauréats: ReadonlyArray<IdentifiantProjet.ValueType>;
  identifiantÉliminés: ReadonlyArray<IdentifiantProjet.ValueType>;
};

export type ConsulterPériodeQuery = Message<
  'Période.Query.ConsulterPériode',
  {
    identifiantPériodeValue: string;
  },
  Option.Type<ConsulterPériodeReadModel>
>;

export type ConsulterPériodeDependencies = {
  find: Find;
};

export const registerConsulterPériodeQuery = ({ find }: ConsulterPériodeDependencies) => {
  const handler: MessageHandler<ConsulterPériodeQuery> = async ({ identifiantPériodeValue }) => {
    const result = await find<PériodeEntity>(`période|${identifiantPériodeValue}`);

    return Option.isSome(result) ? mapToReadModel(result) : Option.none;
  };

  mediator.register('Période.Query.ConsulterPériode', handler);
};

export const mapToReadModel = (période: PériodeEntity): ConsulterPériodeReadModel => {
  const identifiantPériode = Période.IdentifiantPériode.convertirEnValueType(
    période.identifiantPériode,
  );

  if (période.estNotifiée && période.notifiéeLe && période.notifiéePar) {
    return {
      identifiantPériode,
      estNotifiée: true,
      notifiéeLe: DateTime.convertirEnValueType(période.notifiéeLe),
      notifiéePar: Email.convertirEnValueType(période.notifiéePar),
      identifiantLauréats: période.identifiantLauréats.map((identifiantLauréat) =>
        IdentifiantProjet.convertirEnValueType(identifiantLauréat),
      ),
      identifiantÉliminés: période.identifiantÉliminés.map((identifiantÉliminé) =>
        IdentifiantProjet.convertirEnValueType(identifiantÉliminé),
      ),
    };
  }

  return {
    identifiantPériode,
    estNotifiée: false,
  };
};
