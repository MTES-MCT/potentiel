import { mediator, Message, MessageHandler } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '#sendEmail';
import { getLauréat } from '#helpers';

import {
  handleAttestationConformitéTransmise,
  handleDateAchèvementTransmise,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Achèvement.AchèvementEvent;

export type Execute = Message<
  'System.Notification.Lauréat.Achèvement.AttestationConformité',
  SubscriptionEvent
>;

export type RegisterAttestationConformitéNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterAttestationConformitéNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());

    return match(event)
      .with({ type: 'AttestationConformitéTransmise-V1' }, async (event) =>
        handleAttestationConformitéTransmise({ sendEmail, event, projet }),
      )
      .with({ type: 'DateAchèvementTransmise-V1' }, async (event) =>
        handleDateAchèvementTransmise({ sendEmail, event, projet }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat.Achèvement.AttestationConformité', handler);
};
