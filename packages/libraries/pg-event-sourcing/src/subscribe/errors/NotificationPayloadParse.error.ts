/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
export class NotificationPayloadParseError extends Error {
  constructor() {
    super('Notification payload parse error');
  }
}
