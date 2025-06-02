import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type PasserAbandonEnInstructionCommand = Message<
  'Lauréat.Abandon.Command.PasserAbandonEnInstruction',
  {
    dateInstruction: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerPasserAbandonEnInstructionCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<PasserAbandonEnInstructionCommand> = async ({
    identifiantProjet,
    dateInstruction,
    identifiantUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.abandon.passerEnInstruction({
      dateInstruction,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Abandon.Command.PasserAbandonEnInstruction', handler);
};
