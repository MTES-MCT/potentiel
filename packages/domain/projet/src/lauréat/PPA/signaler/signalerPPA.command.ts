import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type SignalerPPACommand = Message<
  'Lauréat.Command.SignalerPPA',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    signaléLe: DateTime.ValueType;
    signaléPar: Email.ValueType;
  }
>;

export const registerSignalerPPACommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<SignalerPPACommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    await projet.lauréat.signalerPPA(payload);
  };
  mediator.register('Lauréat.Command.SignalerPPA', handler);
};
