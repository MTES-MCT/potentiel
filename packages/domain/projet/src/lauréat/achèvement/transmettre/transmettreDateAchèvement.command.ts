import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type TransmettreDateAchèvementCommand = Message<
  'Lauréat.Achèvement.Command.TransmettreDateAchèvement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateAchèvement: DateTime.ValueType;
    attestation: { format: string };
    transmiseLe: DateTime.ValueType;
    transmisePar: Email.ValueType;
  }
>;

export const registerTransmettreDateAchèvementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettreDateAchèvementCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.achèvement.transmettreDateAchèvement(payload);
  };
  mediator.register('Lauréat.Achèvement.Command.TransmettreDateAchèvement', handler);
};
