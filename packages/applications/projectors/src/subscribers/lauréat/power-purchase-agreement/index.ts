import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { powerPurchaseAgreementRebuildTriggeredProjector } from './powerPurchaseAgreementRebuildTrigerred.projector.js';
import { powerPurchaseAgreementSignaléProjector } from './powerPurchaseAgreementSignalé.projector.js';
import { signalementPowerPurchaseAgreementAnnuléProjector } from './signalementPowerPurchaseAgreementAnnulé.projector.js';

export type SubscriptionEvent =
  | Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementEvents
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.PowerPurchaseAgreement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, powerPurchaseAgreementRebuildTriggeredProjector)
      .with({ type: 'PowerPurchaseAgreementSignalé-V1' }, powerPurchaseAgreementSignaléProjector)
      .with(
        { type: 'SignalementPowerPurchaseAgreementAnnulé-V1' },
        signalementPowerPurchaseAgreementAnnuléProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.PowerPurchaseAgreement', handler);
};
