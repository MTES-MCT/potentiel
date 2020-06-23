import { HttpRequest, Pagination } from '../types'
import { listUnnotifiedProjects } from '../useCases'
import { AdminNotifyCandidatesPage } from '../views/pages'
import { Success, Redirect } from '../helpers/responses'
import { makePagination } from '../helpers/paginate'
import routes from '../routes'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 10,
}

const getNotifyCandidatesPage = async (request: HttpRequest) => {
  // console.log('getNotifyCandidatesPage request.query', appelOffreId, periodeId)
  let { appelOffreId, periodeId, recherche, classement } = request.query

  if (!request.user || !['admin', 'dgec'].includes(request.user.role)) {
    return Redirect(routes.LOGIN)
  }

  const pagination = makePagination(request.query, defaultPagination)

  if (!appelOffreId) {
    // Reset the periodId
    periodeId = undefined
  }

  const result = await listUnnotifiedProjects({
    appelOffreId,
    periodeId,
    pagination,
    recherche,
    classement,
  })

  if (result === null) {
    return Success(
      AdminNotifyCandidatesPage({
        request,
      })
    )
  }

  const {
    appelsOffre,
    projects,
    projectsInPeriodCount,
    selectedAppelOffreId,
    selectedPeriodeId,
    existingAppelsOffres,
    existingPeriodes,
  } = result

  return Success(
    AdminNotifyCandidatesPage({
      request,
      results: {
        appelsOffre,
        projects,
        projectsInPeriodCount,
        selectedAppelOffreId,
        selectedPeriodeId,
        existingAppelsOffres,
        existingPeriodes,
      },
    })
  )
}

export { getNotifyCandidatesPage }
