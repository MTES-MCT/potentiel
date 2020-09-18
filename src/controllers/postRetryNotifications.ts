import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { retryFailedNotifications } from '../config'

const postRetryNotifications = async (request: HttpRequest) => {
  if (!request.user || request.user.role !== 'admin') {
    return Redirect(ROUTES.LOGIN)
  }

  const notificationsRetried = await retryFailedNotifications()

  return Redirect(ROUTES.ADMIN_NOTIFICATION_LIST, {
    success: notificationsRetried
      ? `${notificationsRetried} notifications ont été renvoyées`
      : `Aucun notification n\'a été renvoyée. Merci de vérifier qu'il y a bien des notifications en erreur.`,
  })
}
export { postRetryNotifications }
