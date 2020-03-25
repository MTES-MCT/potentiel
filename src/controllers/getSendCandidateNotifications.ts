import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { sendCandidateNotifications } from '../useCases'

const getSendCandidateNotifications = async (request: HttpRequest) => {
  console.log('Call to sendCandidateNotifications received')

  const result = await sendCandidateNotifications({})

  return result.match({
    ok: () =>
      Redirect(ROUTES.ADMIN_DASHBOARD, {
        success: 'Les notifications ont bien été envoyées.'
      }),
    err: (e: Error) => {
      console.log('sendCandidateNotifications failed', e)
      return Redirect(ROUTES.ADMIN_DASHBOARD, {
        error:
          "Les notifications n'ont pas pu être envoyées. (" + e.message + ')'
      })
    }
  })
}
export { getSendCandidateNotifications }
