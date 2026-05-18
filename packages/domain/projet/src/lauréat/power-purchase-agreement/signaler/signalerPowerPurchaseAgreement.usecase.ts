import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import { SignalerPowerPurchaseAgreementCommand } from './signalerPowerPurchaseAgreement.command.js';

export type SignalerPowerPurchaseAgreementUseCase = Message<
  'Lauréat.PowerPurchaseAgreement.UseCase.SignalerPowerPurchaseAgreement',
  {
    identifiantProjetValue: string;
    signaléLeValue: string;
    signaléParValue: string;
  }
>;

export const registerSignalerPowerPurchaseAgreementUseCase = () => {
  const handler: MessageHandler<SignalerPowerPurchaseAgreementUseCase> = async ({
    identifiantProjetValue,
    signaléLeValue,
    signaléParValue,
  }) => {
    await mediator.send<SignalerPowerPurchaseAgreementCommand>({
      type: 'Lauréat.PowerPurchaseAgreement.Command.SignalerPowerPurchaseAgreement',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        signaléLe: DateTime.convertirEnValueType(signaléLeValue),
        signaléPar: Email.convertirEnValueType(signaléParValue),
      },
    });
  };

  mediator.register(
    'Lauréat.PowerPurchaseAgreement.UseCase.SignalerPowerPurchaseAgreement',
    handler,
  );
};
