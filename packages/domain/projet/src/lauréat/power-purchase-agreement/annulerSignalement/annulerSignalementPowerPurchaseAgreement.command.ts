import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type AnnulerSignalementPowerPurchaseAgreementCommand = Message<
  'Lauréat.PowerPurchaseAgreement.Command.AnnulerSignalementPowerPurchaseAgreement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    annuléLe: DateTime.ValueType;
    annuléPar: Email.ValueType;
  }
>;

export const registerAnnulerSignalementPowerPurchaseAgreementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AnnulerSignalementPowerPurchaseAgreementCommand> = async (
    payload,
  ) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    await projet.lauréat.powerPurchaseAgreement.annulerSignalementPowerPurchaseAgreement(payload);
  };
  mediator.register(
    'Lauréat.PowerPurchaseAgreement.Command.AnnulerSignalementPowerPurchaseAgreement',
    handler,
  );
};
