import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import {
  PorteurInvitéEvent,
  RôleUtilisateurModifiéEvent,
  UtilisateurInvitéEvent,
} from '@potentiel-domain/utilisateur';

import { SendEmail } from '#sendEmail';

import {
  handlePorteurInvité,
  handleRôleUtilisateurModifié,
  handleUtilisateurInvité,
} from './handlers/index.js';

export type SubscriptionEvent =
  | PorteurInvitéEvent
  | UtilisateurInvitéEvent
  | RôleUtilisateurModifiéEvent;

export type Execute = Message<'System.Notification.Utilisateur', SubscriptionEvent>;

export type RegisterUtilisateurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'PorteurInvité-V1' }, handlePorteurInvité)
      .with({ type: 'UtilisateurInvité-V2' }, handleUtilisateurInvité)
      .with({ type: 'RôleUtilisateurModifié-V1' }, handleRôleUtilisateurModifié)
      .exhaustive();

  mediator.register('System.Notification.Utilisateur', handler);
};
