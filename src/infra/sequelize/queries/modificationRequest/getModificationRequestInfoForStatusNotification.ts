import { errAsync, wrapInfra } from '@core/utils'
import {
  GetModificationRequestInfoForStatusNotification,
  ModificationRequestInfoForStatusNotificationDTO,
} from '@modules/modificationRequest'
import { EntityNotFoundError } from '@modules/shared'

export const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
  (modificationRequestId: string) => {
    return wrapInfra(
      ModificationRequest.findByPk(modificationRequestId, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['nomProjet', 'departementProjet', 'regionProjet'],
          },
        ],
      })
    ).andThen((modificationRequestRaw) => {
      if (!modificationRequestRaw) {
        return errAsync(new EntityNotFoundError())
      }

      const {
        type,
        projectId,
        project: { nomProjet, departementProjet, regionProjet },
      } = modificationRequestRaw

      return wrapInfra(
        UserProjects.findAll({
          attributes: ['projectId'],
          where: { projectId },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['fullName', 'email', 'id'],
            },
          ],
        })
      ).map(
        (porteursProjets): ModificationRequestInfoForStatusNotificationDTO => ({
          type,
          nomProjet,
          departementProjet,
          regionProjet,
          porteursProjet: porteursProjets.map(({ user: { id, email, fullName } }) => ({
            id,
            email,
            fullName,
          })),
        })
      )
    })
  }
