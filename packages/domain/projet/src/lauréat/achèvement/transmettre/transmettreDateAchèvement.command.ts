import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type TransmettreDateAchèvementCommand = Message<
  'Lauréat.Achèvement.Command.TransmettreDateAchèvement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateAchèvement: DateTime.ValueType;
    transmisLe: DateTime.ValueType;
    transmisPar: Email.ValueType;
  }
>;

export const registerTransmettreDateAchèvementCommand = (_: GetProjetAggregateRoot) => {
  const handler: MessageHandler<TransmettreDateAchèvementCommand> = async (_) => {
    // const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    // await projet.lauréat.achèvement.transmettreDateAchèvement(payload);
  };
  mediator.register('Lauréat.Achèvement.Command.TransmettreDateAchèvement', handler);
};
