export class NotificationPayloadNotAnEventError extends Error {
  constructor() {
    super('Notification payload is not an event');
  }
}
