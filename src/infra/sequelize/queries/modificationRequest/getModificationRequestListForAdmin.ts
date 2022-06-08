import { Op } from 'sequelize'
import { errAsync, ok, okAsync, Result, ResultAsync, wrapInfra } from '@core/utils'
import { getFullTextSearchOptions } from '@dataAccess/db'
import { getProjectAppelOffre } from '@config/queries.config'
import { User } from '@entities'
import { makePaginatedList, paginate } from '../../../../helpers/paginate'
import {
  GetModificationRequestListForAdmin,
  ModificationRequestListItemDTO,
} from '@modules/modificationRequest'
import { InfraNotAvailableError } from '@modules/shared'
import { PaginatedList } from '../../../../types'
import models from '../../models'
import { userIs } from '@modules/users'

function _getPuissanceForAppelOffre(args: { appelOffreId; periodeId }): string {
  return getProjectAppelOffre(args)?.unitePuissance || 'unité de puissance'
}

function _getDrealRegionsForUser(user: User, models) {
  if (user.role !== 'dreal') {
    return okAsync<any, InfraNotAvailableError>([])
  }

  const { UserDreal } = models
  if (!UserDreal) return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    UserDreal.findAll({
      attributes: ['dreal'],
      where: {
        userId: user.id,
      },
    }),
    (e) => {
      console.error(e)
      return new InfraNotAvailableError()
    }
  ).map((items: any) => items.map((item) => item.dreal))
}

const { ModificationRequest, Project, User, File } = models
export const getModificationRequestListForAdmin: GetModificationRequestListForAdmin = ({
  user,
  appelOffreId,
  periodeId,
  familleId,
  modificationRequestType,
  modificationRequestStatus,
  pagination,
  recherche,
  forceNoAuthority,
}) => {
  return _getDrealRegionsForUser(user, models)
    .andThen((drealRegions) => {
      const projectOpts = {
        where: {
          ...(recherche && { [Op.or]: { ...getFullTextSearchOptions(recherche) } }),
          ...(appelOffreId && { appelOffreId }),
          ...(periodeId && { periodeId }),
          ...(familleId && { familleId }),
          ...(userIs('dreal')(user) && { regionProjet: drealRegions }),
        },
      }

      const opts = {
        where: {
          isLegacy: {
            [Op.or]: [false, null],
          },
          ...(userIs('dreal')(user) && { authority: 'dreal' }),
          ...(userIs(['admin', 'dgec'])(user) && !forceNoAuthority && { authority: 'dgec' }),
          ...(modificationRequestType && { type: modificationRequestType }),
          ...(modificationRequestStatus && { status: modificationRequestStatus }),
        },
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
