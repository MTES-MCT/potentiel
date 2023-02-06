import asyncHandler from '../helpers/asyncHandler'
import { makePagination } from '../../helpers/paginate'
import routes from '@routes'
import { Pagination } from '../../types'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import { AdminNotificationCandidatsPage } from '@views'
import { listerProjetsÀNotifier } from '@useCases'

v1Router.get(
  routes.ADMIN_NOTIFY_CANDIDATES(),
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    let { appelOffreId, periodeId, recherche, classement, pageSize } = request.query as any

    const defaultPagination: Pagination = {
      page: 0,
      pageSize: +request.cookies?.pageSize || 10,
    }
    const pagination = makePagination(request.query, defaultPagination)

    if (!appelOffreId) {
      // Reset the periodId
      periodeId = undefined
    }

    const result = await listerProjetsÀNotifier({
      appelOffreId,
      periodeId,
      pagination,
      recherche,
      classement,
      user: request.user,
    })

    if (result === null) {
      return response.send(
        AdminNotificationCandidatsPage({
          request,
        })
      )
    }

    const {
      projects,
      projectsInPeriodCount,
      selectedAppelOffreId,
      selectedPeriodeId,
      existingAppelsOffres,
      existingPeriodes,
    } = result

    if (pageSize) {
      // Save the pageSize in a cookie
      response.cookie('pageSize', pageSize, {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 3, // 3 months
        httpOnly: true,
      })
    }

    response.send(
      AdminNotificationCandidatsPage({
        request,
        results: {
          projects,
          projectsInPeriodCount,
          selectedAppelOffreId,
          selectedPeriodeId,
          existingAppelsOffres,
          existingPeriodes,
        },
      })
    )
  })
)
