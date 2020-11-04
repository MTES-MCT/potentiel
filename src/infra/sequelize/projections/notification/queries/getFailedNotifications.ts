import { UniqueEntityID } from '../../../../../core/domain'
import { errAsync, ResultAsync } from '../../../../../core/utils'
import { GetFailedNotifications } from '../../../../../modules/notification/queries'
import { InfraNotAvailableError } from '../../../../../modules/shared'

export const makeGetFailedNotifications = (models): GetFailedNotifications => () => {
  const NotificationModel = models.Notification
  if (!NotificationModel) return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    NotificationModel.findAll({ where: { status: 'error' } }),
    (e: any) => {
      console.log('getFailedNotifications error', e)
      return new InfraNotAvailableError()
    }
  ).map((items: any) => items.map((item) => new UniqueEntityID(item.get().id.toString())))
}
