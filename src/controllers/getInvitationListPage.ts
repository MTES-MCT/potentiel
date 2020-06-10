import _ from 'lodash'

import { userRepo, projectAdmissionKeyRepo } from '../dataAccess'
import { Redirect, Success, NotFoundError } from '../helpers/responses'
import { Controller, HttpRequest, Pagination } from '../types'
import { InvitationListPage } from '../views/pages'
import { makePagination } from '../helpers/paginate'
import ROUTES from '../routes'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 50,
}

const getInvitationListPage = async (request: HttpRequest) => {
  // console.log('Call to getInvitationListPage received', request.body, request.file)
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const { beforeDate } = request.query

  const pagination = makePagination(request.query, defaultPagination)

  // Get all projectAdmissionKeys that have not been used
  const invitations = await projectAdmissionKeyRepo.findAll(
    {
      lastUsedAt: 0,
      dreal: null,
      projectId: null,
      ...(beforeDate ? { createdAt: { before: Number(beforeDate) } } : {}),
    },
    pagination
  )

  return Success(InvitationListPage({ request, invitations }))
}

export { getInvitationListPage }
