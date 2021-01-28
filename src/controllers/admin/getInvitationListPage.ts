import { appelOffreRepo, projectAdmissionKeyRepo } from '../../dataAccess'
import { makePagination } from '../../helpers/paginate'
import routes from '../../routes'
import { Pagination } from '../../types'
import { InvitationListPage } from '../../views/pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 50,
}

v1Router.get(
  routes.ADMIN_INVITATION_LIST,
  ensureLoggedIn(),
  ensureRole(['admin']),
  async (request, response) => {
    const { appelOffreId, periodeId } = request.query

    const pagination = makePagination(request.query, defaultPagination)

    const appelsOffre = await appelOffreRepo.findAll()

    // Get all projectAdmissionKeys that have not been used
    const invitations = await projectAdmissionKeyRepo.getList(
      {
        lastUsedAt: 0,
        dreal: null,
        projectId: null,
        ...(appelOffreId ? { appelOffreId } : {}),
        ...(periodeId ? { periodeId } : {}),
      },
      pagination
    )

    return response.send(InvitationListPage({ request, invitations, appelsOffre }))
  }
)
