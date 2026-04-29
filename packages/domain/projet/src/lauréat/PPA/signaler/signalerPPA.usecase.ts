import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

import { SignalerPPACommand } from './signalerPPA.command.js';

export type SignalerPPAUseCase = Message<
  'Lauréat.UseCase.SignalerPPA',
  {
    identifiantProjetValue: string;
    signaléLeValue: string;
    signaléParValue: string;
  }
>;

export const registerSignalerPPAUseCase = () => {
  const handler: MessageHandler<SignalerPPAUseCase> = async ({
    identifiantProjetValue,
    signaléLeValue,
    signaléParValue,
  }) => {
    await mediator.send<SignalerPPACommand>({
      type: 'Lauréat.Command.SignalerPPA',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        signaléLe: DateTime.convertirEnValueType(signaléLeValue),
        signaléPar: Email.convertirEnValueType(signaléParValue),
      },
    });
  };

  mediator.register('Lauréat.UseCase.SignalerPPA', handler);
};
