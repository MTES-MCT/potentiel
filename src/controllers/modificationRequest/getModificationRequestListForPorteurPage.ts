import { getModificationRequestListForPorteur } from '@config/queries.config'
import { logger } from '@core/utils'
import { appelOffreRepo } from '@dataAccess/inMemory'
import asyncHandler from '../helpers/asyncHandler'
import { makePagination } from '../../helpers/paginate'
import routes from '../../routes'
import { Pagination } from '../../types'
import { ModificationRequestListPage } from '@views'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.USER_LIST_REQUESTS,
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    const { user, cookies, query } = request

    const {
      appelOffreId,
      periodeId,
      familleId,
      recherche,
      modificationRequestStatus,
      modificationRequestType,
      pageSize,
    } = query as any

    const defaultPagination: Pagination = {
      page: 0,
      pageSize: Number(cookies?.pageSize) || 10,
    }

    const pagination = makePagination(query, defaultPagination)
    const appelsOffre = await appelOffreRepo.findAll()

    if (pageSize) {
      const MONTH_MILLISECONDS = 1000 * 60 * 60 * 24 * 30
      response.cookie('pageSize', pageSize, {
        maxAge: MONTH_MILLISECONDS * 3,
        httpOnly: true,
      })
    }

    return await getModificationRequestListForPorteur({
      user,
      pagination,
      appelOffreId,
      ...(appelOffreId && { periodeId }),
      ...(appelOffreId && { familleId }),
      recherche,
      modificationRequestStatus,
      modificationRequestType,
    }).match(
      (modificationRequests) =>
        response.send(
          ModificationRequestListPage({
            request,
            modificationRequests,
            appelsOffre,
          })
        ),
      (e) => {
        logger.error(e)
        return response
          .status(500)
          .send('Impossible de charger la liste des demandes. Merci de réessayer plus tard.')
      }
    )
  })
)
