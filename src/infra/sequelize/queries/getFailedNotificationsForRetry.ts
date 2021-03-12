import { UniqueEntityID } from '../../../core/domain'
import { errAsync, wrapInfra } from '../../../core/utils'
import { GetFailedNotificationsForRetry } from '../../../modules/notification/queries'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeGetFailedNotificationsForRetry = (
  models
): GetFailedNotificationsForRetry => () => {
  const NotificationModel = models.Notification
  const ProjectModel = models.Project
  const { ProjectStep } = models
  if (!NotificationModel || !ProjectModel) return errAsync(new InfraNotAvailableError())

  return wrapInfra(
    NotificationModel.findAll({ where: { status: 'error' }, order: [['createdAt', 'DESC']] })
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
        const project = await ProjectModel.findByPk(projectId, {
          include: [{ model: ProjectStep, as: 'gf', require: false }],
        })
        if (!project || project.get().gf?.submittedOn) {
          return true
        }
      }
      return false
    }

    return wrapInfra(
      Promise.all(
        notifications
          .map((notification) => notification.get())
          .map(async (notification) => {
            const isObsolete = await _isObsolete(notification)
            return { id: new UniqueEntityID(notification.id), isObsolete }
          })
      )
    )
  })
}
