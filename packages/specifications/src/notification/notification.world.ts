import { EmailPayload } from '@potentiel-applications/notifications';

export class NotificationWorld {
  #notifications: EmailPayload[] = [];

  ajouterNotification(notification: EmailPayload) {
    this.#notifications.push(notification);
  }

  get notifications() {
    return [...this.#notifications];
  }
}
