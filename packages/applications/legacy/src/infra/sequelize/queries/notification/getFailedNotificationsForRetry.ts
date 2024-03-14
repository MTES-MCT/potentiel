import { UniqueEntityID } from '../../../../core/domain';
import { wrapInfra } from '../../../../core/utils';
import { GetFailedNotificationsForRetry } from '../../../../modules/notification';
import { Notification } from '../../projectionsNext';

export const getFailedNotificationsForRetry: GetFailedNotificationsForRetry = () => {
  return wrapInfra(
    Notification.findAll({ where: { status: 'error' }, order: [['createdAt', 'DESC']] }),
  ).andThen((notifications) => {
    const passwordResetEmails: Set<string> = new Set();

    async function _isObsolete(notification) {
      if (notification.type === 'password-reset') {
        if (passwordResetEmails.has(notification.message.email)) {
          return true;
        }
        passwordResetEmails.add(notification.message.email);
      }
      return false;
    }

    return wrapInfra(
      Promise.all(
        notifications
          .map((notification) => notification.get())
          .map(async (notification) => {
            const isObsolete = await _isObsolete(notification);
            return { id: new UniqueEntityID(notification.id), isObsolete };
          }),
      ),
    );
  });
};
