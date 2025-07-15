import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';

import { PasserEnInstructionDemandeDélaiCommand } from './passerEnInstructionDemandeDélai.command';

export type PasserEnInstructionDemandeDélaiUseCase = Message<
  'Lauréat.Délai.UseCase.PasserEnInstructionDemande',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    datePassageEnInstructionValue: string;
  }
>;

export const registerPasserEnInstructionDemandeDélaiUseCase = () => {
  const runner: MessageHandler<PasserEnInstructionDemandeDélaiUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    datePassageEnInstructionValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const datePassageEnInstruction = DateTime.convertirEnValueType(datePassageEnInstructionValue);

    await mediator.send<PasserEnInstructionDemandeDélaiCommand>({
      type: 'Lauréat.Délai.Command.PasserEnInstructionDemande',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        datePassageEnInstruction,
      },
    });
  };

  mediator.register('Lauréat.Délai.UseCase.PasserEnInstructionDemande', runner);
};
