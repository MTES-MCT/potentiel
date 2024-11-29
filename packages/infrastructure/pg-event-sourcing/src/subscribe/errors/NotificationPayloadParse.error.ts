export class NotificationPayloadParseError extends Error {
  constructor(cause: unknown) {
    super('Notification payload parse error', { cause });
  }
}
