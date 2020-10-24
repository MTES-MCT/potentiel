import { makePagination } from '../helpers/paginate'
import { Redirect, Success } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest, Pagination } from '../types'
import { NotificationListPage } from '../views/pages'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 50,
}

const getNotificationListPage = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const pagination = makePagination(request.query, defaultPagination)

  // TOFIX: query new notification service and return a DTO

  return Success(
    NotificationListPage({
      request,
      notifications: { items: [], pagination, pageCount: 0, itemCount: 0 },
    })
  )
}

export { getNotificationListPage }
