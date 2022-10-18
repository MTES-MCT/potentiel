import { getPendingCandidateInvitations, ensureRole } from '@config'
import asyncHandler from '../helpers/asyncHandler'
import { addQueryParams } from '../../helpers/addQueryParams'
import { makePagination } from '../../helpers/paginate'
import routes from '@routes'
import { Pagination } from '../../types'
import { v1Router } from '../v1Router'
import { InvitationsCandidatsEnAttentePage } from '@views'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 50,
}

v1Router.get(
  routes.ADMIN_INVITATION_LIST,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const pagination = makePagination(request.query, defaultPagination)

    await getPendingCandidateInvitations(pagination).match(
      (invitations) => {
        return response.send(InvitationsCandidatsEnAttentePage({ request, invitations }))
      },
      () => {
        return response.redirect(
          addQueryParams(routes.ADMIN_DASHBOARD, {
            error: "La liste des invitations en attente n'a pas pu être générée.",
          })
        )
      }
    )
  })
)
