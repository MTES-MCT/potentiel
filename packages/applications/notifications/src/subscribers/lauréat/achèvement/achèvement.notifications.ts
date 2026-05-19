import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import { handleAttestationConformitéModifiée } from './handlers/attestationConformitéModifiée.handler.js';
import {
  handleAttestationConformitéTransmise,
  handleDateAchèvementTransmise,
} from './handlers/index.js';

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
            'AchèvementModifié-V2',
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
