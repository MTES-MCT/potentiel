import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type AnnulerPowerPurchaseAgreementCommand = Message<
  'Lauréat.PowerPurchaseAgreement.Command.AnnulerPowerPurchaseAgreement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    annuléLe: DateTime.ValueType;
    annuléPar: Email.ValueType;
  }
>;

export const registerAnnulerPowerPurchaseAgreementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AnnulerPowerPurchaseAgreementCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    await projet.lauréat.powerPurchaseAgreement.annulerPowerPurchaseAgreement(payload);
  };
  mediator.register(
    'Lauréat.PowerPurchaseAgreement.Command.AnnulerPowerPurchaseAgreement',
    handler,
  );
};
