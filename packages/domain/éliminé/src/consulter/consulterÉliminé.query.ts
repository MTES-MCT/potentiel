import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ÉliminéEntity } from '../éliminé.entity';

export type ConsulterÉliminéReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  attestation: DocumentProjet.ValueType;
};

export type ConsulterÉliminéQuery = Message<
  'Éliminé.Query.ConsulterÉliminé',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterÉliminéReadModel>
>;

export type ConsulterÉliminéDependencies = {
  find: Find;
};

export const registerConsulterÉliminéQuery = ({ find }: ConsulterÉliminéDependencies) => {
  const handler: MessageHandler<ConsulterÉliminéQuery> = async ({ identifiantProjet }) => {
    const éliminé = await find<ÉliminéEntity>(`éliminé|${identifiantProjet}`);
    if (Option.isNone(éliminé)) {
      return éliminé;
    }

    return mapToReadModel(éliminé);
  };
  mediator.register('Éliminé.Query.ConsulterÉliminé', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  notifiéLe,
  notifiéPar,
  attestation: { format },
}: ÉliminéEntity): ConsulterÉliminéReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  notifiéLe: DateTime.convertirEnValueType(notifiéLe),
  notifiéPar: Email.convertirEnValueType(notifiéPar),
  attestation: DocumentProjet.convertirEnValueType(
    identifiantProjet,
    'attestation',
    notifiéLe,
    format,
  ),
});
