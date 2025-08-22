import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

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
