import moment from 'moment-timezone'
import { v4 as uuid } from 'uuid'
import { eventStore } from '../config'
import { Redirect } from '../helpers/responses'
import { PeriodeNotified } from '../modules/project/events'
import ROUTES from '../routes'
import { HttpRequest } from '../types'

const FORMAT_DATE = 'DD/MM/YYYY'

const postSendCandidateNotifications = async (request: HttpRequest) => {
  const { appelOffreId, periodeId, notificationDate } = request.body

  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  if (!['admin', 'dgec'].includes(request.user.role)) {
    return Redirect(ROUTES.LOGIN)
  }

  if (
    !notificationDate ||
    moment(notificationDate, FORMAT_DATE).format(FORMAT_DATE) !== notificationDate
  ) {
    return Redirect(
      ROUTES.ADMIN_NOTIFY_CANDIDATES({
        appelOffreId,
        periodeId,
      }),
      {
        error:
          "Les notifications n'ont pas pu être envoyées: la date de notification est erronnée.",
      }
    )
  }

  const requestId = uuid()
  const result = await eventStore.publish(
    new PeriodeNotified({
      payload: {
        appelOffreId,
        periodeId,
        notifiedOn: moment(notificationDate, FORMAT_DATE).tz('Europe/Paris').toDate().getTime(),
        requestedBy: request.user.id,
      },
      requestId,
    })
  )

  return result.match(
    () =>
      Redirect(ROUTES.ADMIN_NOTIFY_CANDIDATES(), {
        success: 'La période a bien été notifiée.',
      }),
    (e: Error) => {
      console.log('sendCandidateNotifications failed', e)
      return Redirect(
        ROUTES.ADMIN_NOTIFY_CANDIDATES({
          appelOffreId,
          periodeId,
        }),
        {
          error: "La période n'a pas pu être notifiée. (" + e.message + ')',
        }
      )
    }
  )
}
export { postSendCandidateNotifications }
