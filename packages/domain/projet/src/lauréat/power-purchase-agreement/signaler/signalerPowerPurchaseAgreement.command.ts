import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type SignalerPowerPurchaseAgreementCommand = Message<
  'Lauréat.PowerPurchaseAgreement.Command.SignalerPowerPurchaseAgreement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    signaléLe: DateTime.ValueType;
    signaléPar: Email.ValueType;
  }
>;

export const registerSignalerPowerPurchaseAgreementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SignalerPowerPurchaseAgreementCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    await projet.lauréat.powerPurchaseAgreement.signalerPowerPurchaseAgreement(payload);
  };
  mediator.register(
    'Lauréat.PowerPurchaseAgreement.Command.SignalerPowerPurchaseAgreement',
    handler,
  );
};
