import { retryFailedNotifications } from '../../config'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.ADMIN_NOTIFICATION_RETRY_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin']),
  async (request, response) => {
    const notificationsRetried = await retryFailedNotifications()

    return response.redirect(
      addQueryParams(routes.ADMIN_NOTIFICATION_LIST, {
        success: notificationsRetried
          ? `${notificationsRetried} notifications ont été renvoyées`
          : `Aucun notification n'a été renvoyée. Merci de vérifier qu'il y a bien des notifications en erreur.`,
      })
    )
  }
)
