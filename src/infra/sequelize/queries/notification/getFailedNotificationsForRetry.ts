import { UniqueEntityID } from '@core/domain'
import { wrapInfra } from '@core/utils'
import { FailedNotification, GetFailedNotificationsForRetry } from '@modules/notification'
import models from '../../models'

const { ProjectStep, Notification, Project } = models
export const getFailedNotificationsForRetry: GetFailedNotificationsForRetry = () => {
  return wrapInfra<FailedNotification[]>(
    Notification.findAll({ where: { status: 'error' }, order: [['createdAt', 'DESC']] })
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
        const project = await Project.findByPk(projectId, {
          include: [{ model: ProjectStep, as: 'gf', require: false }],
        })
        if (!project || project.get().gf?.submittedOn) {
          return true
        }
      }
      return false
    }

    return wrapInfra<FailedNotification[]>(
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
