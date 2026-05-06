import { mediator, Message, MessageHandler } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import {
  handlePowerPurchaseAgreementSignalé,
  handleSignalementPowerPurchaseAgreementAnnulé,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementEvents;

export type Execute = Message<
  'System.Notification.Lauréat.PowerPurchaseAgreement',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    return match(event)
      .with({ type: 'PowerPurchaseAgreementSignalé-V1' }, handlePowerPurchaseAgreementSignalé)
      .with(
        { type: 'PowerPurchaseAgreementAnnulé-V1' },
        handleSignalementPowerPurchaseAgreementAnnulé,
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.PowerPurchaseAgreement', handler);
};
