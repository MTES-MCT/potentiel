import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { PasserAbandonEnInstructionCommand } from './passerAbandonEnInstruction.command';

export type PasserEnInstructionAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.PasserAbandonEnInstruction',
  {
    dateInstructionValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
  }
>;

export const registerPasserEnInstructionAbandonUseCase = () => {
  const runner: MessageHandler<PasserEnInstructionAbandonUseCase> = async ({
    dateInstructionValue,
    identifiantProjetValue,
    identifiantUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateInstruction = DateTime.convertirEnValueType(dateInstructionValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<PasserAbandonEnInstructionCommand>({
      type: 'Lauréat.Abandon.Command.PasserAbandonEnInstruction',
      data: {
        dateInstruction,
        identifiantProjet,
        identifiantUtilisateur,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.PasserAbandonEnInstruction', runner);
};
