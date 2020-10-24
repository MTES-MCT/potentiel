import { HttpRequest, Pagination } from '../types'
import { listProjects } from '../useCases'
import { ListProjectsPage } from '../views/pages'
import { Success, Redirect } from '../helpers/responses'
import { makePagination } from '../helpers/paginate'
import ROUTES from '../routes'

import { appelOffreRepo } from '../dataAccess'

const getProjectListPage = async (request: HttpRequest) => {
  let {
    appelOffreId,
    periodeId,
    familleId,
    recherche,
    classement,
    garantiesFinancieres,
  } = request.query

  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  if (['admin', 'dgec', 'dreal'].includes(request.user.role) && typeof classement === 'undefined') {
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
    user: request.user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    garantiesFinancieres,
  })

  const { projects, existingAppelsOffres, existingPeriodes, existingFamilles } = results

  return Success(
    ListProjectsPage({
      request,
      projects,
      existingAppelsOffres,
      existingPeriodes,
      existingFamilles,
      appelsOffre,
    }),
    // Save pageSize in a cookie
    request.query.pageSize
      ? {
          cookies: { pageSize: request.query.pageSize },
        }
      : undefined
  )
}

export { getProjectListPage }
