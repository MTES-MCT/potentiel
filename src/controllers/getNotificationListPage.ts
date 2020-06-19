import _ from 'lodash'

import {
  userRepo,
  projectAdmissionKeyRepo,
  appelOffreRepo,
  notificationRepo,
} from '../dataAccess'
import { Redirect, Success, NotFoundError } from '../helpers/responses'
import { Controller, HttpRequest, Pagination } from '../types'
import { NotificationListPage } from '../views/pages'
import { makePagination } from '../helpers/paginate'
import ROUTES from '../routes'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 50,
}

const getNotificationListPage = async (request: HttpRequest) => {
  // console.log('Call to getNotificationListPage received', request.body, request.file)
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const pagination = makePagination(request.query, defaultPagination)

  const notifications = await notificationRepo.findAll(
    {
      status: ['error', 'retried'],
    },
    pagination
  )

  return Success(NotificationListPage({ request, notifications }))
}

export { getNotificationListPage }
