import { err, ok, wrapInfra } from '@core/utils'
import {
  GetModificationRequestInfoForStatusNotification,
  ModificationRequestInfoForStatusNotificationDTO,
} from '@modules/modificationRequest'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'

const { ModificationRequest, Project, User } = models

export const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification = (
  modificationRequestId: string
) => {
  return wrapInfra(
    ModificationRequest.findByPk(modificationRequestId, {
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['nomProjet', 'departementProjet', 'regionProjet'],
        },
        {
          model: User,
          as: 'requestedBy',
          attributes: ['fullName', 'email', 'id'],
        },
      ],
    })
  ).andThen((modificationRequestRaw: any) => {
    if (!modificationRequestRaw) return err(new EntityNotFoundError())

    const {
      type,
      requestedBy: { email, fullName, id },
      project: { nomProjet, departementProjet, regionProjet },
    } = modificationRequestRaw.get()

    return ok({
      type,
      nomProjet,
      departementProjet,
      regionProjet,
      porteursProjet: [{ id, email, fullName }],
    } as ModificationRequestInfoForStatusNotificationDTO)
  })
}
