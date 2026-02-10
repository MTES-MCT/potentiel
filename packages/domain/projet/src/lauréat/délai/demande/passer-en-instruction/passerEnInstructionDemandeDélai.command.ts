import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type PasserEnInstructionDemandeDélaiCommand = Message<
  'Lauréat.Délai.Command.PasserEnInstructionDemande',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    datePassageEnInstruction: DateTime.ValueType;
    rôleUtilisateur: Role.ValueType;
  }
>;

export const registerPasserEnInstructionDemandeDélaiCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<PasserEnInstructionDemandeDélaiCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    datePassageEnInstruction,
    rôleUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.délai.passerEnInstructionDemandeDélai({
      identifiantUtilisateur,
      datePassageEnInstruction,
      rôleUtilisateur,
    });
  };
  mediator.register('Lauréat.Délai.Command.PasserEnInstructionDemande', handler);
};
