import { Repository } from '../../core/domain';
import { logger } from '../../core/utils';
import { Notification, NotificationArgs } from './Notification';
import { SendEmail } from './SendEmail';

export interface NotificationService {
  sendNotification(args: NotificationArgs): Promise<null>;
}

interface NotificationServiceDeps {
  sendEmail: SendEmail;
  emailSenderAddress: string;
  emailSenderName: string;
  notificationRepo: Repository<Notification>;
}
export const makeNotificationService = (deps: NotificationServiceDeps): NotificationService => {
  return {
    sendNotification,
  };

  async function sendNotification(args: NotificationArgs): Promise<null> {
    const notificationResult = Notification.create(args);
    if (notificationResult.isErr()) {
      logger.error(notificationResult.error);
      logger.info('ERROR: NotificationService.send failed to create a Notification', args);
      return null;
    }

    const notification = notificationResult.value;

    await _send(notification);
    return null;
  }

  async function _send(notification: Notification) {
    await deps
      .sendEmail({
        id: notification.id.toString(),
        fromEmail: deps.emailSenderAddress,
        fromName: deps.emailSenderName,
        subject: notification.message.subject,
        type: notification.type,
        variables: Object.entries(notification.variables).reduce(
          // Prefix all relative urls (starting with /) with the base url
          (newVariables, [key, value]) => ({
            ...newVariables,
            [key]: value?.indexOf('/') === 0 ? process.env.BASE_URL + value : value,
          }),
          {},
        ),
        recipients: [
          {
            email: notification.message.email,
            name: notification.message.name,
          },
        ],
      })
      .match(
        () => {
          // Success
          notification.sent();
        },
        (err) => {
          notification.setError(err.message);
        },
      );
    const saveResult = await deps.notificationRepo.save(notification);
    if (saveResult.isErr()) {
      logger.error(saveResult.error);
      logger.info('ERROR: NotificationService.send failed to save Notification', notification);
    }
  }
};
