import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { sendAllCandidateNotifications } from '../useCases'

const getSendCandidateNotifications = async (request: HttpRequest) => {
  // console.log('Call to sendCandidateNotifications received', request.query)

  const { appelOffreId, periodeId } = request.query

  const result = await sendAllCandidateNotifications({
    appelOffreId,
    periodeId
  })

  return result.match({
    ok: () =>
      Redirect(
        ROUTES.ADMIN_NOTIFY_CANDIDATES({
          appelOffreId,
          periodeId
        }),
        {
          success: 'Les notifications ont bien été envoyées.'
        }
      ),
    err: (e: Error) => {
      console.log('sendCandidateNotifications failed', e)
      return Redirect(
        ROUTES.ADMIN_NOTIFY_CANDIDATES({
          appelOffreId,
          periodeId
        }),
        {
          error:
            "Les notifications n'ont pas pu être envoyées. (" + e.message + ')'
        }
      )
    }
  })
}
export { getSendCandidateNotifications }
