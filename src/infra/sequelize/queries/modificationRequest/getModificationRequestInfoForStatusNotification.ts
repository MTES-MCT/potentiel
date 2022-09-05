import { wrapInfra } from '@core/utils'
import {
  GetModificationRequestInfoForStatusNotification,
  ModificationRequestInfoForStatusNotificationDTO,
} from '@modules/modificationRequest'
import models from '../../models'

const { ModificationRequest, Project, User, UserProjects } = models

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
    ).andThen((modificationRequestRaw: any) => {
      const {
        type,
        projectId,
        project: { nomProjet, departementProjet, regionProjet },
      } = modificationRequestRaw.get()

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
        (porteursProjets: any[]): ModificationRequestInfoForStatusNotificationDTO => ({
          type,
          nomProjet,
          departementProjet,
          regionProjet,
          porteursProjet: porteursProjets.map(({ user }) => ({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          })),
        })
      )
    })
  }
