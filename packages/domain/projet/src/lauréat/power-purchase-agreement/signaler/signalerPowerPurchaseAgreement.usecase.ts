import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantProjet } from '../../../index.js';
import type { SignalerPowerPurchaseAgreementCommand } from './signalerPowerPurchaseAgreement.command.js';

export type SignalerPowerPurchaseAgreementUseCase = Message<
  'Lauréat.PowerPurchaseAgreement.UseCase.SignalerPowerPurchaseAgreement',
  {
    identifiantProjetValue: string;
    signaléLeValue: string;
    signaléParValue: string;
    rôleUtilisateurValue: string;
  }
>;

export const registerSignalerPowerPurchaseAgreementUseCase = () => {
  const handler: MessageHandler<SignalerPowerPurchaseAgreementUseCase> = async ({
    identifiantProjetValue,
    signaléLeValue,
    signaléParValue,
    rôleUtilisateurValue,
  }) => {
    await mediator.send<SignalerPowerPurchaseAgreementCommand>({
      type: 'Lauréat.PowerPurchaseAgreement.Command.SignalerPowerPurchaseAgreement',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        signaléLe: DateTime.convertirEnValueType(signaléLeValue),
        signaléPar: Email.convertirEnValueType(signaléParValue),
        rôleUtilisateur: Role.convertirEnValueType(rôleUtilisateurValue),
      },
    });
  };

  mediator.register(
    'Lauréat.PowerPurchaseAgreement.UseCase.SignalerPowerPurchaseAgreement',
    handler,
  );
};
