import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import type { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { Période } from '../index.js';
import { type IdentifiantPériode, type PériodeEntity, StatutPériode } from '../période.js';

export type ConsulterPériodeReadModel = {
  identifiantPériode: IdentifiantPériode.ValueType;
  statutPériode: Période.StatutPériode.ValueType;

  notifiéeLe?: DateTime.ValueType;
  notifiéePar?: Email.ValueType;
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

export const mapToReadModel = (période: PériodeEntity): ConsulterPériodeReadModel => ({
  identifiantPériode: Période.IdentifiantPériode.convertirEnValueType(période.identifiantPériode),
  statutPériode: StatutPériode.convertirEnValueType(période.statut),
  notifiéeLe: période.notifiéeLe ? DateTime.convertirEnValueType(période.notifiéeLe) : undefined,
  notifiéePar: période.notifiéePar ? Email.convertirEnValueType(période.notifiéePar) : undefined,
});
