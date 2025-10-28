import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { PorteurInvitéEvent, UtilisateurInvitéEvent } from '@potentiel-domain/utilisateur';

import { EmailPayload, SendEmail } from '../../sendEmail';

import { porteurInvitéNotification } from './porteurInvité.notification';
import { utilisateurInvitéNotification } from './utilisateurInvité.notification';

export type SubscriptionEvent = (PorteurInvitéEvent | UtilisateurInvitéEvent) & Event;

export type Execute = Message<'System.Notification.Utilisateur', SubscriptionEvent>;

export type RegisterUtilisateurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterUtilisateurNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const emailPayloads = await match(event)
      .returnType<Promise<EmailPayload[]>>()
      .with({ type: 'PorteurInvité-V1' }, porteurInvitéNotification)
      .with({ type: 'UtilisateurInvité-V2' }, utilisateurInvitéNotification)
      .exhaustive();

    await Promise.all(emailPayloads.map(sendEmail));
  };

  mediator.register('System.Notification.Utilisateur', handler);
};
