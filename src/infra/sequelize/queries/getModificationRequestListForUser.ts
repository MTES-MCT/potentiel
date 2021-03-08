import { errAsync, ok, wrapInfra } from '../../../core/utils'
import { getAppelOffre } from '../../../dataAccess/inMemory/appelOffre'
import { makePaginatedList, paginate } from '../../../helpers/paginate'
import { GetModificationRequestListForUser } from '../../../modules/modificationRequest'
import { InfraNotAvailableError } from '../../../modules/shared'

function _getPuissanceForAppelOffre(args: { appelOffreId; periodeId }): string {
  return getAppelOffre(args)?.unitePuissance || 'unité de puissance'
}

export const makeGetModificationRequestListForUser = (
  models
): GetModificationRequestListForUser => (user, pagination) => {
  const { ModificationRequest, Project, User, File } = models
  if (!ModificationRequest || !Project || !User || !File)
    return errAsync(new InfraNotAvailableError())

  // By default, restrict to the user's modification requests
  let userClause: any = { where: { userId: user.id } }

  if (user.role === 'admin') {
    userClause = {}
  }

  return wrapInfra(
    ModificationRequest.findAndCountAll({
      ...userClause,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: [
            'appelOffreId',
            'periodeId',
            'familleId',
            'nomProjet',
            'communeProjet',
            'departementProjet',
            'regionProjet',
          ],
          required: true,
        },
        {
          model: User,
          as: 'requestedBy',
          attributes: ['fullName', 'email'],
          required: true,
        },
        {
          model: File,
          as: 'attachmentFile',
          attributes: ['id', 'filename'],
          required: false,
        },
      ],
      ...paginate(pagination),
    })
  ).andThen((res: any) => {
    const { count, rows } = res

    const modificationRequests = rows
      .map((row) => row.get())
      .map(
        ({
          id,
          status,
          requestedOn,
          type,
          justification,
          actionnaire,
          fournisseur,
          producteur,
          puissance,
          requestedBy: { email, fullName },
          project: {
            nomProjet,
            communeProjet,
            departementProjet,
            regionProjet,
            appelOffreId,
            periodeId,
            familleId,
          },
          attachmentFile,
        }) => ({
          id,
          status,
          requestedOn: new Date(requestedOn),
          requestedBy: {
            email,
            fullName,
          },
          attachmentFile: attachmentFile && attachmentFile.get(),
          project: {
            nomProjet,
            communeProjet,
            departementProjet,
            regionProjet,
            appelOffreId,
            periodeId,
            familleId,
            unitePuissance: _getPuissanceForAppelOffre({ appelOffreId, periodeId }),
          },
          type,
          justification,
          actionnaire,
          fournisseur,
          producteur,
          puissance: puissance && Number(puissance),
        })
      )

    return ok(makePaginatedList(modificationRequests, count, pagination))
  })
}
