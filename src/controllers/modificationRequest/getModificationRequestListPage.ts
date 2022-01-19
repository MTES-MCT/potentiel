import asyncHandler from 'express-async-handler'
import { getModificationRequestListForUser } from '../../config/queries.config'
import { logger } from '@core/utils'
import { appelOffreRepo } from '../../dataAccess/inMemory'
import { makePagination } from '../../helpers/paginate'
import routes from '../../routes'
import { Pagination } from '../../types'
import { ModificationRequestListPage } from '@views/legacy-pages'
import { ensureRole } from '../../config'
import { v1Router } from '../v1Router'

const getModificationRequestListPage = asyncHandler(async (request, response) => {
  const { user, cookies, query } = request

  let {
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

  if (!appelOffreId) {
    // Reset the periodId and familleId if there is no appelOffreId
    periodeId = undefined
    familleId = undefined
  }

  if (pageSize) {
    const MONTH_MILLISECONDS = 1000 * 60 * 60 * 24 * 30
    response.cookie('pageSize', pageSize, {
      maxAge: MONTH_MILLISECONDS * 3,
      httpOnly: true,
    })
  }

  return await getModificationRequestListForUser({
    user,
    pagination,
    appelOffreId,
    periodeId,
    familleId,
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

v1Router.get(
  routes.ADMIN_LIST_REQUESTS,
  ensureRole(['admin', 'dgec', 'dreal']),
  getModificationRequestListPage
)

v1Router.get(
  routes.USER_LIST_REQUESTS,
  ensureRole(['porteur-projet']),
  getModificationRequestListPage
)
