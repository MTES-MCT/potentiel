import { err, errAsync, ok, ResultAsync } from '../../../core/utils'
import { getAppelOffre } from '../../../dataAccess/inMemory/appelOffre'
import {
  ModificationRequestPageDTO,
  GetModificationRequestDetails,
} from '../../../modules/modificationRequest'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

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
        {
          model: UserModel,
          as: 'respondedByUser',
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
      status,
      requestedOn,
      requestedBy,
      respondedOn,
      respondedByUser,
      justification,
      attachmentFile,
      project,
      versionDate,
    } = modificationRequestRaw.get()

    const { appelOffreId, periodeId } = project
    const unitePuissance = getAppelOffre({ appelOffreId, periodeId })?.unitePuissance || '??'

    return ok({
      id,
      type,
      versionDate,
      status,
      requestedOn: new Date(requestedOn),
      requestedBy: requestedBy.get().fullName,
      respondedOn: respondedOn && new Date(respondedOn),
      respondedBy: respondedByUser && respondedByUser.get().fullName,
      justification,
      attachmentFile: attachmentFile && attachmentFile.get(),
      project: {
        ...project.get(),
        notifiedOn: new Date(project.notifiedOn),
        unitePuissance,
      },
    } as ModificationRequestPageDTO)
  })
}
