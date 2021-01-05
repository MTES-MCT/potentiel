import { err, errAsync, ok, ResultAsync } from '../../../core/utils'
import {
  GetModificationRequestInfoForStatusNotification,
  ModificationRequestInfoForStatusNotificationDTO,
} from '../../../modules/modificationRequest'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeGetModificationRequestUpdateInfo = (
  models
): GetModificationRequestInfoForStatusNotification => (modificationRequestId: string) => {
  const ModificationRequestModel = models.ModificationRequest
  const ProjectModel = models.Project
  const UserModel = models.User
  if (!ModificationRequestModel || !ProjectModel || !UserModel)
    return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    ModificationRequestModel.findByPk(modificationRequestId, {
      include: [
        {
          model: ProjectModel,
          as: 'project',
          attributes: ['nomProjet'],
        },
        {
          model: UserModel,
          as: 'requestedBy',
          attributes: ['fullName', 'email', 'id'],
        },
      ],
    }),
    (e) => {
      console.error(e)
      return new InfraNotAvailableError()
    }
  ).andThen((modificationRequestRaw: any) => {
    if (!modificationRequestRaw) return err(new EntityNotFoundError())

    const { type, requestedBy, project } = modificationRequestRaw.get()

    const { nomProjet } = project
    const { email, fullName, id } = requestedBy

    return ok({
      type,
      nomProjet,
      porteursProjet: [{ id, email, fullName }],
    } as ModificationRequestInfoForStatusNotificationDTO)
  })
}
