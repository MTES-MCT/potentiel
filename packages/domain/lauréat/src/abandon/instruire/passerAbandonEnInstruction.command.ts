import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadAbandonFactory } from '../abandon.aggregate';

export type PasserAbandonEnInstructionCommand = Message<
  'Lauréat.Abandon.Command.PasserAbandonEnInstruction',
  {
    dateInstruction: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerPasserAbandonEnInstructionCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<PasserAbandonEnInstructionCommand> = async ({
    identifiantProjet,
    dateInstruction,
    identifiantUtilisateur,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);

    await abandon.passerEnInstruction({
      dateInstruction,
      identifiantUtilisateur,
      identifiantProjet,
    });
  };
  mediator.register('Lauréat.Abandon.Command.PasserAbandonEnInstruction', handler);
};
