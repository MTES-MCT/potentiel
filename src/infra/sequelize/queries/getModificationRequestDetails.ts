import { err, errAsync, ok, wrapInfra } from '../../../core/utils'
import { getAppelOffre } from '../../../dataAccess/inMemory/appelOffre'
import {
  GetModificationRequestDetails,
  ModificationRequestPageDTO,
} from '../../../modules/modificationRequest'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeGetModificationRequestDetails = (models): GetModificationRequestDetails => (
  modificationRequestId
) => {
  const { ModificationRequest, Project, File, User } = models
  if (!ModificationRequest || !Project || !File || !User)
    return errAsync(new InfraNotAvailableError())

  return wrapInfra(
    ModificationRequest.findByPk(modificationRequestId, {
      include: [
        {
          model: File,
          as: 'attachmentFile',
          attributes: ['id', 'filename'],
        },
        {
          model: File,
          as: 'responseFile',
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
            'numeroGestionnaire',
            'completionDueOn',
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
    })
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
      responseFile,
      project,
      versionDate,
      delayInMonths,
      puissance,
      actionnaire,
      fournisseur,
      producteur,
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
      responseFile: responseFile?.get(),
      justification,
      attachmentFile: attachmentFile?.get(),
      delayInMonths,
      puissance,
      actionnaire,
      fournisseur,
      producteur,
      project: {
        ...project.get(),
        notifiedOn: new Date(project.notifiedOn),
        completionDueOn: new Date(project.completionDueOn),
        unitePuissance,
      },
    } as ModificationRequestPageDTO)
  })
}
