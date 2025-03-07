import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { PasserRecoursEnInstructionCommand } from './passerRecoursEnInstruction.command';

export type PasserEnInstructionRecoursUseCase = Message<
  'Éliminé.Recours.UseCase.PasserRecoursEnInstruction',
  {
    dateInstructionValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
  }
>;

export const registerPasserRecoursEnInstructionUseCase = () => {
  const runner: MessageHandler<PasserEnInstructionRecoursUseCase> = async ({
    dateInstructionValue,
    identifiantProjetValue,
    identifiantUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateInstruction = DateTime.convertirEnValueType(dateInstructionValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<PasserRecoursEnInstructionCommand>({
      type: 'Éliminé.Recours.Command.PasserRecoursEnInstruction',
      data: {
        dateInstruction,
        identifiantProjet,
        identifiantUtilisateur,
      },
    });
  };
  mediator.register('Éliminé.Recours.UseCase.PasserRecoursEnInstruction', runner);
};
