import { err, ok, wrapInfra } from '@core/utils'
import { getProjectAppelOffre } from '@config/queries.config'
import {
  GetModificationRequestDetails,
  isModificationPuissanceAuto,
} from '@modules/modificationRequest'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'

const { ModificationRequest, Project, File, User } = models

export const getModificationRequestDetails: GetModificationRequestDetails = (
  modificationRequestId
) => {
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
            'puissanceInitiale',
            'notifiedOn',
            'appelOffreId',
            'periodeId',
            'familleId',
            'numeroGestionnaire',
            'completionDueOn',
            'potentielIdentifier',
            'technologie',
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
        {
          model: User,
          as: 'cancelledByUser',
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
      cancelledByUser,
      justification,
      attachmentFile,
      responseFile,
      project,
      versionDate,
      delayInMonths,
      puissance,
      actionnaire,
      fournisseurs,
      evaluationCarbone,
      producteur,
      acceptanceParams,
      cancelledOn,
    } = modificationRequestRaw.get()

    const { appelOffreId, periodeId } = project
    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId })

    return ok({
      id,
      type,
      versionDate: new Date(versionDate).getTime(),
      status,
      requestedOn: new Date(requestedOn).getTime(),
      requestedBy: requestedBy.get().fullName,
      respondedOn: respondedOn && new Date(respondedOn).getTime(),
      respondedBy: respondedByUser?.get().fullName,
      responseFile: responseFile?.get(),
      cancelledOn: cancelledOn && new Date(cancelledOn).getTime(),
      cancelledBy: cancelledByUser?.get().fullName,
      acceptanceParams,
      justification,
      attachmentFile: attachmentFile?.get(),
      delayInMonths,
      actionnaire,
      fournisseurs,
      evaluationCarbone,
      producteur,
      project: {
        ...project.get(),
        notifiedOn: new Date(project.notifiedOn).getTime(),
        completionDueOn: new Date(project.completionDueOn).getTime(),
        unitePuissance: appelOffre?.unitePuissance || '??',
      },
      ...(type === 'puissance' && {
        ...isModificationPuissanceAuto({
          project: { ...project, appelOffre, technologie: project.technologie ?? 'N/A' },
          nouvellePuissance: puissance,
        }),
        puissance,
      }),
    })
  })
}
