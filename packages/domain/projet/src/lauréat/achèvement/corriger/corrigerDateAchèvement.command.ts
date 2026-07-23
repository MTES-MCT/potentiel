import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type CorrigerDateAchèvementCommand = Message<
  'Lauréat.Achèvement.Command.CorrigerDateAchèvement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateAchèvement: DateTime.ValueType;
    corrigéeLe: DateTime.ValueType;
    corrigéePar: Email.ValueType;
  }
>;

export const registerCorrigerDateAchèvementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<CorrigerDateAchèvementCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.achèvement.corrigerDateAchèvement(payload);
  };
  mediator.register('Lauréat.Achèvement.Command.CorrigerDateAchèvement', handler);
};
