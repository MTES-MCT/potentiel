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
  const { ModificationRequest, Project, File, User } = models
  if (!ModificationRequest || !Project || !File || !User)
    return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    ModificationRequest.findByPk(modificationRequestId, {
      include: [
        {
          model: File,
          as: 'attachmentFile',
          attributes: ['id', 'filename'],
        },
        {
          model: Project,
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
          model: User,
          as: 'requestedBy',
          attributes: ['fullName'],
        },
        {
          model: User,
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
      respondedBy: respondedByUser?.get().fullName,
      justification,
      attachmentFile: attachmentFile?.get(),
      project: {
        ...project.get(),
        notifiedOn: new Date(project.notifiedOn),
        unitePuissance,
      },
    } as ModificationRequestPageDTO)
  })
}
