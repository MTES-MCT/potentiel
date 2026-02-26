import { mediator, Message, MessageHandler } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import {
  handleDateAchèvementTransmise,
  handleAttestationConformitéTransmise,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Achèvement.AchèvementEvent;

export type Execute = Message<'System.Notification.Lauréat.Achèvement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    return match(event)
      .with({ type: 'AttestationConformitéTransmise-V1' }, handleAttestationConformitéTransmise)
      .with({ type: 'DateAchèvementTransmise-V1' }, handleDateAchèvementTransmise)
      .with(
        {
          type: P.union(
            'AttestationConformitéModifiée-V1',
            'DateAchèvementPrévisionnelCalculée-V1',
          ),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Achèvement', handler);
};
