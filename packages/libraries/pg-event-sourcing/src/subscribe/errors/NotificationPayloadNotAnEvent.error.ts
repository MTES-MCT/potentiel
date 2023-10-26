/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
export class NotificationPayloadNotAnEventError extends Error {
  constructor() {
    super('Notification payload is not an event');
  }
}
