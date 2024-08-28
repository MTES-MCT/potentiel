import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { LauréatEntity } from '../lauréat.entity';

export type ConsulterLauréatReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDésignation: DateTime.ValueType;
  attestationSignée: DocumentProjet.ValueType;
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
  dateDésignation,
  attestationSignée: { format },
}: LauréatEntity): ConsulterLauréatReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  dateDésignation: DateTime.convertirEnValueType(dateDésignation),
  attestationSignée: DocumentProjet.convertirEnValueType(
    identifiantProjet,
    'attestation',
    dateDésignation,
    format,
  ),
});
