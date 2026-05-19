import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import { handlePowerPurchaseAgreementSignalé } from './handlers/index.js';
import { handleSignalementPowerPurchaseAgreementAnnulé } from './handlers/signalementPowerPurchaseAgreementAnnulé.handler.js';

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
        { type: 'SignalementPowerPurchaseAgreementAnnulé-V1' },
        handleSignalementPowerPurchaseAgreementAnnulé,
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.PowerPurchaseAgreement', handler);
};
