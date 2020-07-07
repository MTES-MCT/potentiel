import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { sendAllCandidateNotifications } from '../useCases'
import moment from 'moment'

const FORMAT_DATE = 'DD/MM/YYYY'

const postSendCandidateNotifications = async (request: HttpRequest) => {
  // console.log('Call to sendCandidateNotifications received', request.body)

  const { appelOffreId, periodeId, notificationDate } = request.body

  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  if (
    !notificationDate ||
    moment(notificationDate, FORMAT_DATE).format(FORMAT_DATE) !==
      notificationDate
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

  const result = await sendAllCandidateNotifications({
    appelOffreId,
    periodeId,
    notifiedOn: moment(notificationDate, FORMAT_DATE).toDate().getTime(),
    user: request.user,
  })

  return result.match({
    ok: () =>
      Redirect(
        ROUTES.ADMIN_NOTIFY_CANDIDATES({
          appelOffreId,
          periodeId,
        }),
        {
          success: 'Les notifications ont bien été envoyées.',
        }
      ),
    err: (e: Error) => {
      console.log('sendCandidateNotifications failed', e)
      return Redirect(
        ROUTES.ADMIN_NOTIFY_CANDIDATES({
          appelOffreId,
          periodeId,
        }),
        {
          error:
            "Les notifications n'ont pas pu être envoyées. (" + e.message + ')',
        }
      )
    },
  })
}
export { postSendCandidateNotifications }
