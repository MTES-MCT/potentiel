import { Project } from '../entities'
import { HttpRequest } from '../types'
import { listProjects } from '../useCases'
import { AdminListProjectsPage } from '../views/pages'
import { Success } from '../helpers/responses'

import { appelOffreRepo } from '../dataAccess'

const getAdminDashboardPage = async (request: HttpRequest) => {
  // console.log('getAdminDashboardPage request.query', request.query)
  let { appelOffreId, periodeId } = request.query

  const appelsOffre = await appelOffreRepo.findAll()

  if (!appelOffreId) {
    // Reset the periodId if there is no appelOffreId
    periodeId = undefined
  }

  const projects = await listProjects({
    appelOffreId,
    periodeId,
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
