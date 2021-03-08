import { err, errAsync, ok, wrapInfra } from '../../../core/utils'
import { GetInfoForModificationRequested } from '../../../modules/notification'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeGetInfoForModificationRequested = (models): GetInfoForModificationRequested => ({
  projectId,
  userId,
}) => {
  const { Project, User } = models
  if (!Project || !User) return errAsync(new InfraNotAvailableError())

  return wrapInfra(
    Project.findByPk(projectId, {
      attributes: ['nomProjet'],
    })
  )
    .andThen((project: any) => {
      return wrapInfra(
        User.findByPk(userId, {
          attributes: ['fullName', 'email'],
        })
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
