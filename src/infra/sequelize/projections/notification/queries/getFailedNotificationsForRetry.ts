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
  ).andThen((items: any) => {
    const passwordResetEmails: string[] = []

    return ResultAsync.fromPromise(
      Promise.all(
        items
          .map((item) => item.get())
          .map(async (item) => {
            let isObsolete = false

            if (item.type === 'password-reset') {
              if (passwordResetEmails.includes(item.message.email)) {
                isObsolete = true
              } else passwordResetEmails.push(item.message.email)
            } else if (item.type === 'relance-gf') {
              const { projectId } = item.context
              const project = await ProjectModel.findByPk(projectId)
              if (!project || project.get().garantiesFinancieresSubmittedOn) {
                isObsolete = true
              }
            }

            return { id: new UniqueEntityID(item.id), isObsolete }
          })
      ),
      (e: any) => {
        console.error(e)
        return new InfraNotAvailableError()
      }
    )
  })
}
