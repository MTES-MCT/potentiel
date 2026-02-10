import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port.js';
import { IdentifiantProjet } from '../../../index.js';

export type PasserRecoursEnInstructionCommand = Message<
  'Éliminé.Recours.Command.PasserRecoursEnInstruction',
  {
    dateInstruction: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerPasserRecoursEnInstructionCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<PasserRecoursEnInstructionCommand> = async ({
    identifiantProjet,
    dateInstruction,
    identifiantUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.éliminé.recours.passerEnInstruction({
      dateInstruction,
      identifiantUtilisateur,
    });
  };
  mediator.register('Éliminé.Recours.Command.PasserRecoursEnInstruction', handler);
};
