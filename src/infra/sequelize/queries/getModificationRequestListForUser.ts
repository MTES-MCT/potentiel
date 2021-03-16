import { Op } from 'sequelize'
import { errAsync, ok, wrapInfra } from '../../../core/utils'
import { getFullTextSearchOptions } from '../../../dataAccess/db/project'
import { getAppelOffre } from '../../../dataAccess/inMemory/appelOffre'
import { makePaginatedList, paginate } from '../../../helpers/paginate'
import { GetModificationRequestListForUser } from '../../../modules/modificationRequest'
import { InfraNotAvailableError } from '../../../modules/shared'

function _getPuissanceForAppelOffre(args: { appelOffreId; periodeId }): string {
  return getAppelOffre(args)?.unitePuissance || 'unité de puissance'
}

export const makeGetModificationRequestListForUser = (
  models
): GetModificationRequestListForUser => ({
  user,
  appelOffreId,
  periodeId,
  familleId,
  modificationRequestType,
  modificationRequestStatus,
  pagination,
  recherche,
}) => {
  const { ModificationRequest, Project, User, File } = models
  if (!ModificationRequest || !Project || !User || !File)
    return errAsync(new InfraNotAvailableError())

  const projectOpts: any = { where: {} }

  if (recherche) {
    projectOpts.where[Op.or] = { ...getFullTextSearchOptions(recherche) }
  }

  if (appelOffreId) {
    projectOpts.where.appelOffreId = appelOffreId
  }

  if (periodeId) {
    projectOpts.where.periodeId = periodeId
  }

  if (familleId) {
    projectOpts.where.familleId = familleId
  }

  const opts: any = { where: {} }

  // By default, restrict to the user's modification requests
  if (user.role !== 'admin') opts.where.userId = user.id

  if (modificationRequestType) {
    opts.where.type = { [Op.eq]: modificationRequestType }
  }

  if (modificationRequestStatus) {
    opts.where.status = { [Op.eq]: modificationRequestStatus }
  }

  return wrapInfra(
    ModificationRequest.findAndCountAll({
      ...opts,
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
          ...projectOpts,
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
      order: [['createdAt', 'DESC']],
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
