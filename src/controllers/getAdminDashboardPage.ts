import { Project } from '../entities'
import { HttpRequest, Pagination } from '../types'
import { listProjects } from '../useCases'
import { AdminListProjectsPage } from '../views/pages'
import { Success } from '../helpers/responses'
import { makePagination } from '../helpers/paginate'

import { appelOffreRepo } from '../dataAccess'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 10,
}

const getAdminDashboardPage = async (request: HttpRequest) => {
  // console.log('getAdminDashboardPage request.query', request.query)
  let { appelOffreId, periodeId } = request.query

  const pagination = makePagination(request.query, defaultPagination)

  const appelsOffre = await appelOffreRepo.findAll()

  if (!appelOffreId) {
    // Reset the periodId if there is no appelOffreId
    periodeId = undefined
  }

  const projects = await listProjects({
    appelOffreId,
    periodeId,
    pagination,
  })

  return Success(
    AdminListProjectsPage({
      request,
      projects,
      appelsOffre,
      selectedAppelOffreId: appelOffreId,
      selectedPeriodeId: periodeId,
    })
  )
}

export { getAdminDashboardPage }
