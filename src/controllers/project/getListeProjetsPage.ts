import { appelOffreRepo } from '@dataAccess'
import asyncHandler from '../helpers/asyncHandler'
import { makePagination } from '../../helpers/paginate'
import routes from '@routes'
import { Pagination } from '../../types'
import { listProjects } from '@useCases'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import { ListeProjetsPage } from '@views'

const getProjectListPage = asyncHandler(async (request, response) => {
  let {
    appelOffreId,
    periodeId,
    familleId,
    recherche,
    classement,
    reclames,
    garantiesFinancieres,
    pageSize,
  } = request.query as any
  const { user } = request

  // Set default filter on classés for admins
  if (
    ['admin', 'dgec-validateur', 'dreal'].includes(user.role) &&
    typeof classement === 'undefined'
  ) {
    classement = 'classés'
    request.query.classement = 'classés'
  }

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: +request.cookies?.pageSize || 10,
  }
  const pagination = makePagination(request.query, defaultPagination)

  const appelsOffre = await appelOffreRepo.findAll()

  if (!appelOffreId) {
    // Reset the periodId and familleId if there is no appelOffreId
    periodeId = undefined
    familleId = undefined
  }

  const results = await listProjects({
    user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    reclames,
    garantiesFinancieres,
  })

  const { projects, existingAppelsOffres, existingPeriodes, existingFamilles } = results

  if (pageSize) {
    // Save the pageSize in a cookie
    response.cookie('pageSize', pageSize, {
      maxAge: 1000 * 60 * 60 * 24 * 30 * 3, // 3 months
      httpOnly: true,
    })
  }

  response.send(
    ListeProjetsPage({
      request,
      projects,
      existingAppelsOffres,
      existingPeriodes,
      existingFamilles,
      appelsOffre,
    })
  )
})

v1Router.get(
  routes.ADMIN_DASHBOARD,
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  getProjectListPage
)

v1Router.get(
  routes.USER_DASHBOARD,
  ensureRole(['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'ademe']),
  getProjectListPage
)
