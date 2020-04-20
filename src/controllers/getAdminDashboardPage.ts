import { Project } from '../entities'
import { HttpRequest, Pagination } from '../types'
import { listProjects } from '../useCases'
import { AdminListProjectsPage } from '../views/pages'
import { Success } from '../helpers/responses'
import { makePagination } from '../helpers/paginate'

import { appelOffreRepo } from '../dataAccess'
import famille from '../entities/famille'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 10,
}

const getAdminDashboardPage = async (request: HttpRequest) => {
  // console.log('getAdminDashboardPage request.query', request.query)
  let { appelOffreId, periodeId, familleId } = request.query

  const pagination = makePagination(request.query, defaultPagination)

  const appelsOffre = await appelOffreRepo.findAll()

  if (!appelOffreId) {
    // Reset the periodId and familleId if there is no appelOffreId
    periodeId = undefined
    familleId = undefined
  }

  const projects = await listProjects({
    appelOffreId,
    periodeId,
    familleId,
    pagination,
  })

  return Success(
    AdminListProjectsPage({
      request,
      projects,
      appelsOffre,
      selectedAppelOffreId: appelOffreId,
      selectedPeriodeId: periodeId,
      selectedFamilleId: familleId,
    })
  )
}

export { getAdminDashboardPage }
