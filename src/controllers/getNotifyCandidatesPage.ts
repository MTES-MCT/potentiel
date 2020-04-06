import { HttpRequest } from '../types'
import { listUnnotifiedProjects } from '../useCases'
import { AdminNotifyCandidatesPage } from '../views/pages'
import { Success, Redirect } from '../helpers/responses'
import routes from '../routes'

import { appelOffreRepo } from '../dataAccess'

const getNotifyCandidatesPage = async (request: HttpRequest) => {
  let { appelOffreId, periodeId } = request.query
  // console.log('getNotifyCandidatesPage request.query', appelOffreId, periodeId)

  const appelsOffre = await appelOffreRepo.findAll()

  const appelOffre = appelsOffre.find(item => item.id === appelOffreId)

  if (!appelOffreId || !appelOffre) {
    console.log('Cannot find appelOffreId', appelOffreId)
    // No valid AO, take the first
    appelOffreId = appelsOffre[0].id
    periodeId = appelsOffre[0].periodes[0].id

    return Redirect(routes.ADMIN_NOTIFY_CANDIDATES({ appelOffreId, periodeId }))
  }

  if (
    !periodeId ||
    !appelOffre.periodes.find(periode => periode.id === periodeId)
  ) {
    // No valid période, take the first from this AO
    console.log('Cannot find periodeId', periodeId)
    periodeId = appelOffre.periodes[0].id

    return Redirect(routes.ADMIN_NOTIFY_CANDIDATES({ appelOffreId, periodeId }))
  }

  // console.log('All good')

  const projects = await listUnnotifiedProjects({
    appelOffreId,
    periodeId
  })

  // TODO only list projects that are not notified for this AO / periode

  return Success(
    AdminNotifyCandidatesPage({
      request,
      projects,
      appelsOffre,
      selectedAppelOffreId: appelOffreId,
      selectedPeriodeId: periodeId
    })
  )
}

export { getNotifyCandidatesPage }
