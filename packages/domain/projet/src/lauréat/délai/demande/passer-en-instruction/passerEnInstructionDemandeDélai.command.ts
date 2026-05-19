import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

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
