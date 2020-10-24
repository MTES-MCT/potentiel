import { Repository } from '../../core/domain'
import { Notification, NotificationArgs } from './Notification'
import { GetFailedNotifications } from './queries'
import { SendEmail } from './SendEmail'

export interface NotificationService {
  sendNotification(args: NotificationArgs): Promise<null>
  retryFailedNotifications(): Promise<number>
}

interface NotificationServiceDeps {
  sendEmail: SendEmail
  emailSenderAddress: string
  notificationRepo: Repository<Notification>
  getFailedNotifications: GetFailedNotifications
}
export const makeNotificationService = (deps: NotificationServiceDeps): NotificationService => {
  return {
    sendNotification,
    retryFailedNotifications,
  }

  async function sendNotification(args: NotificationArgs): Promise<null> {
    const notificationResult = Notification.create(args)
    if (notificationResult.isErr()) {
      console.log(
        'ERROR: NotificationService.send failed to create a Notification',
        args,
        notificationResult.error
      )
      return null
    }

    const notification = notificationResult.value

    await _send(notification)
    return null
  }

  async function retryFailedNotifications(): Promise<number> {
    const failedNotificationIdsResult = await deps.getFailedNotifications()

    if (failedNotificationIdsResult.isErr()) {
      console.log(
        'NotificationService.retryFailedNotifications errored',
        failedNotificationIdsResult.error
      )
      return 0
    }

    const failedNotificationIds = failedNotificationIdsResult.value

    let retriedNotificationCount = 0

    for (const failedNotificationId of failedNotificationIds) {
      const failedNotificationResult = await deps.notificationRepo.load(failedNotificationId)

      if (failedNotificationResult.isErr()) {
        console.log(
          'NotificationService.retryFailedNotifications found a failed notification but could not load it',
          failedNotificationId
        )
        continue
      }

      const failedNotification = failedNotificationResult.value

      // Create a clone of the failed notification and send it
      const retryNotification = Notification.clone(failedNotification)
      await _send(retryNotification)

      // Update the status of the failed notification to retried
      failedNotification.retried()
      retriedNotificationCount++

      const saveResult = await deps.notificationRepo.save(failedNotification)
      if (saveResult.isErr()) {
        console.log(
          'ERROR: NotificationService.retryFailedNotification failed to save retried notification',
          failedNotification,
          saveResult.error
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
        fromName: 'Cellule PV',
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
      console.log(
        'ERROR: NotificationService.send failed to save Notification',
        notification,
        saveResult.error
      )
    }
  }
}
