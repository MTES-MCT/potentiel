import { retryFailedNotifications } from '../../config'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.post(
  routes.ADMIN_NOTIFICATION_RETRY_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    const notificationsRetried = await retryFailedNotifications()

    return response.redirect(
      addQueryParams(routes.ADMIN_NOTIFICATION_LIST, {
        success: notificationsRetried
          ? `${notificationsRetried} notifications ont été renvoyées`
          : `Aucun notification n'a été renvoyée. Merci de vérifier qu'il y a bien des notifications en erreur.`,
      })
    )
  })
)
