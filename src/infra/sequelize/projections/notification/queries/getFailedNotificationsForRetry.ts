import { UniqueEntityID } from '../../../../../core/domain'
import { errAsync, ResultAsync } from '../../../../../core/utils'
import { GetFailedNotificationsForRetry } from '../../../../../modules/notification/queries'
import { InfraNotAvailableError } from '../../../../../modules/shared'

export const makeGetFailedNotificationsForRetry = (
  models
): GetFailedNotificationsForRetry => () => {
  const NotificationModel = models.Notification
  if (!NotificationModel) return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    NotificationModel.findAll({ where: { status: 'error' }, order: [['createdAt', 'DESC']] }),
    (e: any) => {
      console.log('getFailedNotifications error', e)
      return new InfraNotAvailableError()
    }
  ).map((items: any) => {
    const passwordResetEmails: string[] = []

    return items
      .map((item) => item.get())
      .map((item) => {
        let isObsolete = false

        if (item.type === 'password-reset') {
          if (passwordResetEmails.includes(item.message.email)) {
            isObsolete = true
          } else passwordResetEmails.push(item.message.email)
        }

        return { id: new UniqueEntityID(item.id), isObsolete }
      })
  })
}
