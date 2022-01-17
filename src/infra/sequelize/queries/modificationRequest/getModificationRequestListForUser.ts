import { Op } from 'sequelize'
import { errAsync, ok, okAsync, Result, ResultAsync, wrapInfra } from '@core/utils'
import { getFullTextSearchOptions } from '../../../../dataAccess/db/project'
import { getAppelOffre } from '../../../../dataAccess/inMemory/appelOffre'
import { User } from '../../../../entities'
import { makePaginatedList, paginate } from '../../../../helpers/paginate'
import {
  GetModificationRequestListForUser,
  ModificationRequestListItemDTO,
} from '@modules/modificationRequest'
import { InfraNotAvailableError } from '@modules/shared'
import { PaginatedList } from '../../../../types'
import models from '../../models'

function _getPuissanceForAppelOffre(args: { appelOffreId; periodeId }): string {
  return getAppelOffre(args)?.unitePuissance || 'unité de puissance'
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
export const getModificationRequestListForUser: GetModificationRequestListForUser = ({
  user,
  appelOffreId,
  periodeId,
  familleId,
  modificationRequestType,
  modificationRequestStatus,
  pagination,
  recherche,
}) => {
  return _getDrealRegionsForUser(user, models)
    .andThen((drealRegions) => {
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

      const opts: any = { where: { isLegacy: { [Op.or]: [false, null] } } }

      if (user.role === 'porteur-projet') opts.where.userId = user.id
      if (user.role === 'dreal') {
        opts.where.authority = 'dreal'
        projectOpts.where.regionProjet = drealRegions
      }
      if (user.role === 'admin' || user.role === 'dgec') {
        opts.where.authority = 'dgec'
      }

      if (modificationRequestType) {
        opts.where.type = modificationRequestType

        if (user.role === 'admin' || user.role === 'dgec') {
          // Admins can see any request (even dreals) when they set the type
          delete opts.where.authority
        }
      }

      if (modificationRequestStatus) {
        opts.where.status = modificationRequestStatus
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
