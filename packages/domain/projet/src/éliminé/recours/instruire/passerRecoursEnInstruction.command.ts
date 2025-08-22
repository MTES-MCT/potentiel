import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { IdentifiantProjet } from '../../..';
import type { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

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
