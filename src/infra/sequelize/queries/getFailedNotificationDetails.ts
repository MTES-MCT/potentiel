import { errAsync, ResultAsync } from '../../../core/utils'
import { makePaginatedList, paginate } from '../../../helpers/paginate'
import { FailedNotificationDTO, GetFailedNotificationDetails } from '../../../modules/notification'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeGetFailedNotificationDetails = (models): GetFailedNotificationDetails => (
  pagination
) => {
  const NotificationModel = models.Notification
  if (!NotificationModel) return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    NotificationModel.findAndCountAll({
      where: { status: 'error' },
      order: [['createdAt', 'DESC']],
      ...paginate(pagination),
    }),
    (e: any) => {
      console.error(e)
      return new InfraNotAvailableError()
    }
  ).map(({ count, rows }) =>
    makePaginatedList(
      rows
        .map((item) => item.get())
        .map(
          ({ id, message, type, createdAt, error }) =>
            ({
              id,
              recipient: {
                email: message.email,
                name: message.name || '',
              },
              type,
              createdAt,
              error,
            } as FailedNotificationDTO)
        ),
      count,
      pagination
    )
  )
}
