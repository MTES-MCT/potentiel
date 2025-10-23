import { MessageResult, Message } from 'mediateur';

import { EmailPayload } from '@potentiel-applications/notifications';

import { PotentielWorld } from '../potentiel.world';

export async function mockEmailAdapter(
  this: PotentielWorld,
  emailPayload: EmailPayload,
): Promise<MessageResult<Message>> {
  this.notificationWorld.ajouterNotification(emailPayload);
}
