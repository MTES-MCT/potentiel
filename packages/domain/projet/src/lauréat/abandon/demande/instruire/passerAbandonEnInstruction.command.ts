import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type PasserAbandonEnInstructionCommand = Message<
  'Lauréat.Abandon.Command.PasserAbandonEnInstruction',
  {
    dateInstruction: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    rôleUtilisateur: Role.ValueType;
  }
>;

export const registerPasserAbandonEnInstructionCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<PasserAbandonEnInstructionCommand> = async ({
    identifiantProjet,
    dateInstruction,
    identifiantUtilisateur,
    rôleUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.abandon.passerEnInstruction({
      dateInstruction,
      identifiantUtilisateur,
      rôleUtilisateur,
    });
  };
  mediator.register('Lauréat.Abandon.Command.PasserAbandonEnInstruction', handler);
};
