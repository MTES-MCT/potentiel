import { getFailedNotificationDetails } from '../../config'
import { logger } from '../../core/utils'
import { makePagination } from '../../helpers/paginate'
import routes from '../../routes'
import { Pagination } from '../../types'
import { NotificationListPage } from '../../views/legacy-pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

const defaultPagination: Pagination = {
  page: 0,
  pageSize: 50,
}

v1Router.get(
  routes.ADMIN_NOTIFICATION_LIST,
  ensureLoggedIn(),
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    const pagination = makePagination(request.query, defaultPagination)

    return await getFailedNotificationDetails(pagination).match(
      (notifications) =>
        response.send(
          NotificationListPage({
            request,
            notifications,
          })
        ),
      (e) => {
        logger.error(e)
        return response
          .status(500)
          .send('Impossible de charger la liste des notifications en erreur.')
      }
    )
  })
)
