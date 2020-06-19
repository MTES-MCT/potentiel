import { NotificationProps } from '../entities'
import { NotificationRepo } from '../dataAccess'
import { ResultAsync, Ok } from '../types'
import routes from '../routes'
import _ from 'lodash'

interface MakeUseCaseProps {
  notificationRepo: NotificationRepo
  sendNotification: (props: NotificationProps) => Promise<void>
}

export default function makeRetryNotifications({
  notificationRepo,
  sendNotification,
}: MakeUseCaseProps) {
  return async function retryNotifications(): ResultAsync<number> {
    const erroredNotifications = await notificationRepo.findAll({
      status: 'error',
    })

    // Resend these notifications
    await Promise.all(erroredNotifications.map(sendNotification))

    // Update the old erroredNotifications
    await Promise.all(
      erroredNotifications
        .map((notification) => ({
          ...notification,
          status: 'retried',
        }))
        .map(notificationRepo.save)
    )

    return Ok(erroredNotifications.length)
  }
}
