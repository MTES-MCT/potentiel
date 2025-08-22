import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getLauréat } from '../../../helpers';
import type { SendEmail } from '../../../sendEmail';
import { attestationConformitéTransmiseNotifications } from './attestationConformitéTransmise.notifications';

export type SubscriptionEvent =
  Lauréat.Achèvement.AttestationConformité.AttestationConformitéEvent & Event;

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
        attestationConformitéTransmiseNotifications({ sendEmail, event, projet }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat.Achèvement.AttestationConformité', handler);
};
