import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

import { AnnulerPowerPurchaseAgreementCommand } from './annulerPowerPurchaseAgreement.command.js';

export type AnnulerPowerPurchaseAgreementUseCase = Message<
  'Lauréat.PowerPurchaseAgreement.UseCase.AnnulerPowerPurchaseAgreement',
  {
    identifiantProjetValue: string;
    annuléLeValue: string;
    annuléParValue: string;
  }
>;

export const registerAnnulerPowerPurchaseAgreementUseCase = () => {
  const handler: MessageHandler<AnnulerPowerPurchaseAgreementUseCase> = async ({
    identifiantProjetValue,
    annuléLeValue,
    annuléParValue,
  }) => {
    await mediator.send<AnnulerPowerPurchaseAgreementCommand>({
      type: 'Lauréat.PowerPurchaseAgreement.Command.AnnulerPowerPurchaseAgreement',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        annuléLe: DateTime.convertirEnValueType(annuléLeValue),
        annuléPar: Email.convertirEnValueType(annuléParValue),
      },
    });
  };

  mediator.register(
    'Lauréat.PowerPurchaseAgreement.UseCase.AnnulerPowerPurchaseAgreement',
    handler,
  );
};
