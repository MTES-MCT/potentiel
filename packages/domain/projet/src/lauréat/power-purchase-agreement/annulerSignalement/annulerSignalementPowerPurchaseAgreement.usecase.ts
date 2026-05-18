import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import { AnnulerSignalementPowerPurchaseAgreementCommand } from './annulerSignalementPowerPurchaseAgreement.command.js';

export type AnnulerSignalementPowerPurchaseAgreementUseCase = Message<
  'Lauréat.PowerPurchaseAgreement.UseCase.AnnulerSignalementPowerPurchaseAgreement',
  {
    identifiantProjetValue: string;
    annuléLeValue: string;
    annuléParValue: string;
  }
>;

export const registerAnnulerSignalementPowerPurchaseAgreementUseCase = () => {
  const handler: MessageHandler<AnnulerSignalementPowerPurchaseAgreementUseCase> = async ({
    identifiantProjetValue,
    annuléLeValue,
    annuléParValue,
  }) => {
    await mediator.send<AnnulerSignalementPowerPurchaseAgreementCommand>({
      type: 'Lauréat.PowerPurchaseAgreement.Command.AnnulerSignalementPowerPurchaseAgreement',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        annuléLe: DateTime.convertirEnValueType(annuléLeValue),
        annuléPar: Email.convertirEnValueType(annuléParValue),
      },
    });
  };

  mediator.register(
    'Lauréat.PowerPurchaseAgreement.UseCase.AnnulerSignalementPowerPurchaseAgreement',
    handler,
  );
};
