import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type SignalerPowerPurchaseAgreementCommand = Message<
  'Lauréat.PowerPurchaseAgreement.Command.SignalerPowerPurchaseAgreement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    signaléLe: DateTime.ValueType;
    signaléPar: Email.ValueType;
    rôleUtilisateur: Role.ValueType;
  }
>;

export const registerSignalerPowerPurchaseAgreementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SignalerPowerPurchaseAgreementCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    await projet.lauréat.powerPurchaseAgreement.signaler(payload);
  };
  mediator.register(
    'Lauréat.PowerPurchaseAgreement.Command.SignalerPowerPurchaseAgreement',
    handler,
  );
};
