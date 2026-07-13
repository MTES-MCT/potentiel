import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import { handleAttestationConformitéModifiée } from './handlers/attestationConformitéModifiée.handler.js';
import {
  handleAchèvementModifié,
  handleAttestationConformitéTransmise,
  handleDateAchèvementTransmise,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Achèvement.AchèvementEvent;

export type Execute = Message<'System.Notification.Lauréat.Achèvement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    return match(event)
      .with({ type: 'AttestationConformitéTransmise-V2' }, handleAttestationConformitéTransmise)
      .with({ type: 'AttestationConformitéModifiée-V2' }, handleAttestationConformitéModifiée)
      .with({ type: 'DateAchèvementTransmise-V1' }, handleDateAchèvementTransmise)
      .with(
        {
          type: 'AchèvementModifié-V2',
        },
        handleAchèvementModifié,
      )
      .with(
        {
          type: P.union(
            'AttestationConformitéTransmise-V1',
            'AttestationConformitéEnregistrée-V1',
            'AttestationConformitéEnregistrée-V2',
            'AchèvementModifié-V1',
            'DateAchèvementPrévisionnelCalculée-V1',
            'AttestationConformitéModifiée-V1',
            'DateAchèvementCorrigée-V1',
          ),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Achèvement', handler);
};
