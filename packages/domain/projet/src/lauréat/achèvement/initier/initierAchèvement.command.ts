import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type InitierAchèvementCommand = Message<
  'Lauréat.Achèvement.Command.InitierAchèvement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    initiéLe: DateTime.ValueType;
    initiéPar: Email.ValueType;
  }
>;

export const registerInitierAchèvementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<InitierAchèvementCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.achèvement.initierAchèvement(payload);
  };
  mediator.register('Lauréat.Achèvement.Command.InitierAchèvement', handler);
};
