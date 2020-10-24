import { projectAdmissionKeyRepo, appelOffreRepo } from '../dataAccess'
import { Redirect, Success } from '../helpers/responses'
import { HttpRequest, Pagination } from '../types'
import { InvitationListPage } from '../views/pages'
import { makePagination } from '../helpers/paginate'
import ROUTES from '../routes'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 50,
}

const getInvitationListPage = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

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

  return Success(InvitationListPage({ request, invitations, appelsOffre }))
}

export { getInvitationListPage }
