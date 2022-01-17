import { err, ok, wrapInfra } from '@core/utils'
import { GetInfoForModificationRequested } from '@modules/notification'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'

const { Project, User } = models

export const getInfoForModificationRequested: GetInfoForModificationRequested = ({
  projectId,
  userId,
}) => {
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
