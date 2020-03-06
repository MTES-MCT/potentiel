import { sendCandidateNotifications } from '../useCases'
import { Controller, HttpRequest } from '../types'
import ROUTES from '../routes'

export default function makeGetSendCandidateNotifications(): Controller {
  return async (request: HttpRequest) => {
    console.log('Call to sendCandidateNotifications received')

    try {
      await sendCandidateNotifications({})
      return {
        redirect: ROUTES.ADMIN_DASHBOARD,
        query: { success: 'Les notifications ont bien été envoyées.' }
      }
    } catch (e) {
      console.log('sendCandidateNotifications failed', e)
      return {
        redirect: ROUTES.ADMIN_DASHBOARD,
        query: {
          error: "Les notifications n'ont pas pu être envoyées. (" + e + ')'
        }
      }
    }
  }
}
