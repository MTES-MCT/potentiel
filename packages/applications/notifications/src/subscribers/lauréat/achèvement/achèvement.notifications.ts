import { mediator, Message, MessageHandler } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import {
  handleDateAchèvementTransmise,
  handleAttestationConformitéTransmise,
} from './handlers/index.js';
import { handleAttestationConformitéModifiée } from './handlers/attestationConformitéModifiée.handler.js';

export type SubscriptionEvent = Lauréat.Achèvement.AchèvementEvent;

export type Execute = Message<'System.Notification.Lauréat.Achèvement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    return match(event)
      .with({ type: 'AttestationConformitéTransmise-V1' }, handleAttestationConformitéTransmise)
      .with({ type: 'AttestationConformitéModifiée-V1' }, handleAttestationConformitéModifiée)
      .with({ type: 'DateAchèvementTransmise-V1' }, handleDateAchèvementTransmise)
      .with(
        {
          type: P.union(
            'AchèvementModifié-V1',
            'AttestationConformitéEnregistrée-V1',
            'DateAchèvementPrévisionnelCalculée-V1',
          ),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Achèvement', handler);
};
