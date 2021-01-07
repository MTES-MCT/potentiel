import { UniqueEntityID } from '../../../../../core/domain'
import { errAsync, ResultAsync } from '../../../../../core/utils'
import { GetFailedNotificationsForRetry } from '../../../../../modules/notification/queries'
import { InfraNotAvailableError } from '../../../../../modules/shared'

export const makeGetFailedNotificationsForRetry = (
  models
): GetFailedNotificationsForRetry => () => {
  const NotificationModel = models.Notification
  const ProjectModel = models.Project
  if (!NotificationModel || !ProjectModel) return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    NotificationModel.findAll({ where: { status: 'error' }, order: [['createdAt', 'DESC']] }),
    (e: any) => {
      console.error(e)
      return new InfraNotAvailableError()
    }
  ).andThen((notifications: any) => {
    const passwordResetEmails: Set<string> = new Set()

    async function _isObsolete(notification): Promise<boolean> {
      if (notification.type === 'password-reset') {
        if (passwordResetEmails.has(notification.message.email)) {
          return true
        }
        passwordResetEmails.add(notification.message.email)
      } else if (notification.type === 'relance-gf') {
        const { projectId } = notification.context
        const project = await ProjectModel.findByPk(projectId)
        if (!project || project.get().garantiesFinancieresSubmittedOn) {
          return true
        }
      }
      return false
    }

    return ResultAsync.fromPromise(
      Promise.all(
        notifications
          .map((notification) => notification.get())
          .map(async (notification) => {
            const isObsolete = await _isObsolete(notification)
            return { id: new UniqueEntityID(notification.id), isObsolete }
          })
      ),
      (e: any) => {
        console.error(e)
        return new InfraNotAvailableError()
      }
    )
  })
}
