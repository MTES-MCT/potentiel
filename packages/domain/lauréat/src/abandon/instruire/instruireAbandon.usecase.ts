import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { InstruireAbandonCommand } from './instruireAbandon.command';

export type InstruireAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.InstruireAbandon',
  {
    dateInstructionValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
  }
>;

export const registerInstruireAbandonUseCase = () => {
  const runner: MessageHandler<InstruireAbandonUseCase> = async ({
    dateInstructionValue,
    identifiantProjetValue,
    identifiantUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateInstruction = DateTime.convertirEnValueType(dateInstructionValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<InstruireAbandonCommand>({
      type: 'Lauréat.Abandon.Command.InstruireAbandon',
      data: {
        dateInstruction,
        identifiantProjet,
        identifiantUtilisateur,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.InstruireAbandon', runner);
};
