import { err, errAsync, ok, ResultAsync } from '../../../../../core/utils'
import { getAppelOffre } from '../../../../../dataAccess/inMemory/appelOffre'
import {
  AdminModificationRequestDTO,
  GetModificationRequestDetails,
} from '../../../../../modules/modificationRequest'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../../../modules/shared'

export const makeGetModificationRequestDetails = (models): GetModificationRequestDetails => (
  modificationRequestId: string
) => {
  const ModificationRequestModel = models.ModificationRequest
  const ProjectModel = models.Project
  const FileModel = models.File
  const UserModel = models.User
  if (!ModificationRequestModel || !ProjectModel || !FileModel || !UserModel)
    return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    ModificationRequestModel.findByPk(modificationRequestId, {
      include: [
        {
          model: FileModel,
          as: 'attachmentFile',
          attributes: ['id', 'filename'],
        },
        {
          model: ProjectModel,
          as: 'project',
          attributes: [
            'id',
            'numeroCRE',
            'nomProjet',
            'nomCandidat',
            'communeProjet',
            'departementProjet',
            'regionProjet',
            'puissance',
            'notifiedOn',
            'appelOffreId',
            'periodeId',
            'familleId',
          ],
        },
        {
          model: UserModel,
          as: 'requestedBy',
          attributes: ['fullName'],
        },
      ],
    }),
    (e) => {
      console.error(e)
      return new InfraNotAvailableError()
    }
  ).andThen((modificationRequestRaw: any) => {
    if (!modificationRequestRaw) return err(new EntityNotFoundError())

    const {
      id,
      type,
      requestedOn,
      requestedBy,
      justification,
      attachmentFile,
      project,
      updatedAt,
    } = modificationRequestRaw.get()

    const { appelOffreId, periodeId } = project
    const unitePuissance = getAppelOffre({ appelOffreId, periodeId })?.unitePuissance || '??'

    return ok({
      id,
      type,
      versionDate: updatedAt,
      requestedOn: new Date(requestedOn),
      requestedBy: requestedBy.get().fullName,
      justification,
      attachmentFile: attachmentFile.get(),
      project: {
        ...project.get(),
        notifiedOn: new Date(project.notifiedOn),
        unitePuissance,
      },
    } as AdminModificationRequestDTO)
  })
}
