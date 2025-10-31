import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { PorteurInvitéEvent, UtilisateurInvitéEvent } from '@potentiel-domain/utilisateur';

import { SendEmail } from '../../sendEmail';

import { handlePorteurInvité, handleUtilisateurInvité } from './handlers';

export type SubscriptionEvent = (PorteurInvitéEvent | UtilisateurInvitéEvent) & Event;

export type Execute = Message<'System.Notification.Utilisateur', SubscriptionEvent>;

export type RegisterUtilisateurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterUtilisateurNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'PorteurInvité-V1' }, (event) => handlePorteurInvité({ event, sendEmail }))
      .with({ type: 'UtilisateurInvité-V2' }, (event) =>
        handleUtilisateurInvité({ event, sendEmail }),
      )
      .exhaustive();

  mediator.register('System.Notification.Utilisateur', handler);
};
