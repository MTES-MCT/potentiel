import { makePagination } from '../helpers/paginate'
import { Redirect, Success, SystemError } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest, Pagination } from '../types'
import { NotificationListPage } from '../views/pages'
import { getFailedNotificationDetails } from '../config'
import { logger } from '../core/utils'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 50,
}

const getNotificationListPage = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const pagination = makePagination(request.query, defaultPagination)

  return await getFailedNotificationDetails(pagination).match(
    (notifications) =>
      Success(
        NotificationListPage({
          request,
          notifications,
        })
      ),
    (e) => {
      logger.error(e)
      return SystemError('Impossible de charger la liste des notifications en erreur.')
    }
  )
}

export { getNotificationListPage }
