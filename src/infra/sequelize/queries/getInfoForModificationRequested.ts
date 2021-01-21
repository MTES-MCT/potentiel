import { err, errAsync, ok, ResultAsync } from '../../../core/utils'
import { GetInfoForModificationRequested } from '../../../modules/notification'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeGetInfoForModificationRequested = (models): GetInfoForModificationRequested => ({
  projectId,
  userId,
}) => {
  const { Project, User } = models
  if (!Project || !User) return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    Project.findByPk(projectId, {
      attributes: ['nomProjet'],
    }),
    (e) => {
      console.error(e)
      return new InfraNotAvailableError()
    }
  )
    .andThen((project: any) => {
      return ResultAsync.fromPromise(
        User.findByPk(userId, {
          attributes: ['fullName', 'email'],
        }),
        (e) => {
          console.error(e)
          return new InfraNotAvailableError()
        }
      ).map((user: any) => ({ user, project }))
    })
    .andThen(({ user, project }) => {
      if (!project || !user) return err(new EntityNotFoundError())

      const { fullName, email } = user
      return ok({
        nomProjet: project.nomProjet,
        porteurProjet: {
          fullName,
          email,
        },
      })
    })
}
