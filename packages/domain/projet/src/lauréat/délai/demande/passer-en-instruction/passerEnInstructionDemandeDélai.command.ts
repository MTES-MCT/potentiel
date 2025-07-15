import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type PasserEnInstructionDemandeDélaiCommand = Message<
  'Lauréat.Délai.Command.PasserEnInstructionDemande',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    datePassageEnInstruction: DateTime.ValueType;
  }
>;

export const registerPasserEnInstructionDemandeDélaiCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<PasserEnInstructionDemandeDélaiCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    datePassageEnInstruction,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.délai.passerEnInstructionDemandeDélai({
      identifiantUtilisateur,
      datePassageEnInstruction,
    });
  };
  mediator.register('Lauréat.Délai.Command.PasserEnInstructionDemande', handler);
};
