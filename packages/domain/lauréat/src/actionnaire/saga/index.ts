import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { LauréatNotifiéEvent } from '../../lauréat';
import { AbandonAccordéEvent } from '../../abandon';
import { AttestationConformitéTransmiseEvent } from '../../achèvement';

import { handleLauréatNotifié } from './handleLauréatNotifié';
import { handleAbandonAccordé } from './handleAbandonAccordé';
import { handleAttestationConformitéTransmise } from './handleAttestationConformitéTransmise';

export type SubscriptionEvent =
  | LauréatNotifiéEvent
  | AbandonAccordéEvent
  | AttestationConformitéTransmiseEvent;

export type Execute = Message<'System.Lauréat.Actionnaire.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'LauréatNotifié-V1' }, handleLauréatNotifié)
      .with({ type: 'AbandonAccordé-V1' }, handleAbandonAccordé)
      .with({ type: 'AttestationConformitéTransmise-V1' }, handleAttestationConformitéTransmise)
      .exhaustive();

  mediator.register('System.Lauréat.Actionnaire.Saga.Execute', handler);
};
