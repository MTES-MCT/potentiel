import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadRecoursFactory } from '../recours.aggregate';

export type PasserRecoursEnInstructionCommand = Message<
  'Éliminé.Recours.Command.PasserRecoursEnInstruction',
  {
    dateInstruction: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerPasserRecoursEnInstructionCommand = (loadAggregate: LoadAggregate) => {
  const loadRecours = loadRecoursFactory(loadAggregate);
  const handler: MessageHandler<PasserRecoursEnInstructionCommand> = async ({
    identifiantProjet,
    dateInstruction,
    identifiantUtilisateur,
  }) => {
    const recours = await loadRecours(identifiantProjet);

    await recours.passerEnInstruction({
      dateInstruction,
      identifiantUtilisateur,
      identifiantProjet,
    });
  };
  mediator.register('Éliminé.Recours.Command.PasserRecoursEnInstruction', handler);
};
