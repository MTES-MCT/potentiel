import { Repository } from '../../core/domain'
import { logger } from '../../core/utils'
import { Notification, NotificationArgs } from './Notification'
import { GetFailedNotificationsForRetry } from './queries'
import { SendEmail } from './SendEmail'

export interface NotificationService {
  sendNotification(args: NotificationArgs): Promise<null>
  retryFailedNotifications(): Promise<number>
}

interface NotificationServiceDeps {
  sendEmail: SendEmail
  emailSenderAddress: string
  emailSenderName: string
  notificationRepo: Repository<Notification>
  getFailedNotificationsForRetry: GetFailedNotificationsForRetry
}
export const makeNotificationService = (deps: NotificationServiceDeps): NotificationService => {
  return {
    sendNotification,
    retryFailedNotifications,
  }

  async function sendNotification(args: NotificationArgs): Promise<null> {
    const notificationResult = Notification.create(args)
    if (notificationResult.isErr()) {
      logger.error(notificationResult.error)
      logger.info('ERROR: NotificationService.send failed to create a Notification', args)
      return null
    }

    const notification = notificationResult.value

    await _send(notification)
    return null
  }

  async function retryFailedNotifications(): Promise<number> {
    const failedNotificationsResult = await deps.getFailedNotificationsForRetry()

    if (failedNotificationsResult.isErr()) {
      logger.error(failedNotificationsResult.error)
      return 0
    }

    const failedNotifications = failedNotificationsResult.value

    let retriedNotificationCount = 0

    for (const { id, isObsolete } of failedNotifications) {
      const failedNotificationResult = await deps.notificationRepo.load(id)

      if (failedNotificationResult.isErr()) {
        logger.error(
          `NotificationService.retryFailedNotifications found a failed notification but could not load it. Id : ${id}`
        )
        continue
      }

      const failedNotification = failedNotificationResult.value

      if (!isObsolete) {
        // Create a clone of the failed notification and send it
        const retryNotification = Notification.clone(failedNotification)
        await _send(retryNotification)

        // Update the status of the failed notification to retried
        failedNotification.retried()
        retriedNotificationCount++
      } else {
        // The failed notification is now obsolete
        // Mark it as cancelled
        failedNotification.cancelled()
      }

      const saveResult = await deps.notificationRepo.save(failedNotification)
      if (saveResult.isErr()) {
        logger.error(saveResult.error)
        logger.info(
          'ERROR: NotificationService.retryFailedNotification failed to save retried notification',
          failedNotification
        )
      }
    }

    return retriedNotificationCount
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
          {}
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
          notification.sent()
        },
        (err) => {
          notification.setError(err.message)
        }
      )
    const saveResult = await deps.notificationRepo.save(notification)
    if (saveResult.isErr()) {
      logger.error(saveResult.error)
      logger.info('ERROR: NotificationService.send failed to save Notification', notification)
    }
  }
}
