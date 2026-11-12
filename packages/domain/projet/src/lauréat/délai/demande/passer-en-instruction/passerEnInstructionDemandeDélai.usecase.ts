import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantProjet } from '../../../../index.js';
import type { PasserEnInstructionDemandeDélaiCommand } from './passerEnInstructionDemandeDélai.command.js';

export type PasserEnInstructionDemandeDélaiUseCase = Message<
  'Lauréat.Délai.UseCase.PasserEnInstructionDemande',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    datePassageEnInstructionValue: string;
    rôleUtilisateurValue: string;
    dateDemandeValue: string;
  }
>;

export const registerPasserEnInstructionDemandeDélaiUseCase = () => {
  const runner: MessageHandler<PasserEnInstructionDemandeDélaiUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    datePassageEnInstructionValue,
    rôleUtilisateurValue,
    dateDemandeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const datePassageEnInstruction = DateTime.convertirEnValueType(datePassageEnInstructionValue);
    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
    const rôle = Role.convertirEnValueType(rôleUtilisateurValue);

    await mediator.send<PasserEnInstructionDemandeDélaiCommand>({
      type: 'Lauréat.Délai.Command.PasserEnInstructionDemande',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        datePassageEnInstruction,
        rôleUtilisateur: rôle,
        dateDemande,
      },
    });
  };

  mediator.register('Lauréat.Délai.UseCase.PasserEnInstructionDemande', runner);
};
