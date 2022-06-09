import { Op } from 'sequelize'
import { errAsync, ok, okAsync, Result, ResultAsync, wrapInfra } from '@core/utils'
import { getFullTextSearchOptions } from '@dataAccess/db'
import { getProjectAppelOffre } from '@config/queries.config'
import { User } from '@entities'
import { makePaginatedList, paginate } from '../../../../helpers/paginate'
import {
  GetModificationRequestListForPorteur,
  ModificationRequestListItemDTO,
} from '@modules/modificationRequest'
import { InfraNotAvailableError } from '@modules/shared'
import { PaginatedList } from '../../../../types'
import models from '../../models'

function _getPuissanceForAppelOffre(args: { appelOffreId; periodeId }): string {
  return getProjectAppelOffre(args)?.unitePuissance || 'unité de puissance'
}

const { ModificationRequest, Project, User, File, UserProjects } = models
export const getModificationRequestListForPorteur: GetModificationRequestListForPorteur = ({
  user,
  appelOffreId,
  periodeId,
  familleId,
  modificationRequestType,
  modificationRequestStatus,
  pagination,
  recherche,
}) => {
  const projectOpts = {
    where: {
      ...(recherche && { [Op.or]: { ...getFullTextSearchOptions(recherche) } }),
      ...(appelOffreId && { appelOffreId }),
      ...(periodeId && { periodeId }),
      ...(familleId && { familleId }),
    },
  }

  return wrapInfra(
    ModificationRequest.findAndCountAll({
      where: {
        isLegacy: {
          [Op.or]: [false, null],
        },
        userId: user.id,
        ...(modificationRequestType && { type: modificationRequestType }),
        ...(modificationRequestStatus && { status: modificationRequestStatus }),
      },
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
        {
          model: UserProjects,
          where: { userId: user.id },
          required: true,
        },
      ],
      order: [['createdAt', 'DESC']],
      ...paginate(pagination),
    })
  ).andThen(
    (res: any): Result<PaginatedList<ModificationRequestListItemDTO>, InfraNotAvailableError> => {
      const { count, rows } = res

      const modificationRequests: ModificationRequestListItemDTO[] = rows
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
    }
  )
}
