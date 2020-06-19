import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { retryNotifications } from '../useCases'
import moment from 'moment'

const postRetryNotifications = async (request: HttpRequest) => {
  if (!request.user || request.user.role !== 'admin') {
    return Redirect(ROUTES.LOGIN)
  }

  const result = await retryNotifications()
  return result.match({
    ok: (retriesSent: number) =>
      Redirect(ROUTES.ADMIN_NOTIFICATION_LIST, {
        success: retriesSent
          ? `${retriesSent} notifications ont été renvoyées`
          : `Aucun notification n\'a été renvoyée. Merci de vérifier qu'il y a bien des notifications en erreur.`,
      }),
    err: (e: Error) => {
      console.log('postRetryNotifications failed', e)
      return Redirect(ROUTES.ADMIN_NOTIFICATION_LIST, {
        error: `Les notifications n'ont pas pu être renvoyées. (Erreur: ${e.message})`,
      })
    },
  })
}
export { postRetryNotifications }
