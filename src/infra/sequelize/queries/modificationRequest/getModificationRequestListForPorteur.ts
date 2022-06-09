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

const { ModificationRequest, Project, User, File } = models
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
  return _getProjectIdsForUser(user, models)
    .andThen((projectIds) => {
      return wrapInfra(
        ModificationRequest.findAndCountAll({
          where: {
            isLegacy: {
              [Op.or]: [false, null],
            },
            projectId: {
              [Op.in]: projectIds,
            },
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
              where: {
                ...(recherche && { [Op.or]: { ...getFullTextSearchOptions(recherche) } }),
                ...(appelOffreId && { appelOffreId }),
                ...(periodeId && { periodeId }),
                ...(familleId && { familleId }),
              },
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
      )
    })
    .andThen(
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

function _getPuissanceForAppelOffre(args: { appelOffreId; periodeId }): string {
  return getProjectAppelOffre(args)?.unitePuissance || 'unité de puissance'
}

function _getProjectIdsForUser(user: User, models) {
  if (user.role !== 'porteur-projet') {
    return okAsync<any, InfraNotAvailableError>([])
  }

  const { UserProjects } = models
  if (!UserProjects) return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    UserProjects.findAll({
      attributes: ['projectId'],
      where: {
        userId: user.id,
      },
    }),
    (e) => {
      console.error(e)
      return new InfraNotAvailableError()
    }
  ).map((items: any) => items.map((item) => item.projectId))
}
