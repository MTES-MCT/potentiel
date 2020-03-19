import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { sendCandidateNotifications } from '../useCases'

const getSendCandidateNotifications = async (request: HttpRequest) => {
  console.log('Call to sendCandidateNotifications received')

  const result = await sendCandidateNotifications({})

  if (result.is_err()) {
    console.log('sendCandidateNotifications failed', result.unwrap_err())
    return Redirect(ROUTES.ADMIN_DASHBOARD, {
      error:
        "Les notifications n'ont pas pu être envoyées. (" +
        result.unwrap_err().message +
        ')'
    })
  }

  return Redirect(ROUTES.ADMIN_DASHBOARD, {
    success: 'Les notifications ont bien été envoyées.'
  })
}
export { getSendCandidateNotifications }
