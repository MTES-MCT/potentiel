import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantProjet } from '../../../../index.js';

import { PasserAbandonEnInstructionCommand } from './passerAbandonEnInstruction.command.js';

export type PasserEnInstructionAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.PasserAbandonEnInstruction',
  {
    dateInstructionValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
    rôleUtilisateurValue: string;
  }
>;

export const registerPasserEnInstructionAbandonUseCase = () => {
  const runner: MessageHandler<PasserEnInstructionAbandonUseCase> = async ({
    dateInstructionValue,
    identifiantProjetValue,
    identifiantUtilisateurValue,
    rôleUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateInstruction = DateTime.convertirEnValueType(dateInstructionValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const rôleUtilisateur = Role.convertirEnValueType(rôleUtilisateurValue);

    await mediator.send<PasserAbandonEnInstructionCommand>({
      type: 'Lauréat.Abandon.Command.PasserAbandonEnInstruction',
      data: {
        dateInstruction,
        identifiantProjet,
        identifiantUtilisateur,
        rôleUtilisateur,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.PasserAbandonEnInstruction', runner);
};
