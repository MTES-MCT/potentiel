import { HttpRequest } from '../types'
import { showNotification } from '../useCases'
import { CandidateNotificationPage } from '../views/pages'
import { Success, NotFoundError, SystemError } from '../helpers/responses'

const getCandidateNotification = async (request: HttpRequest) => {
  // console.log('Call to getCandidateNotification received', request.query)

  if (!request.query.id) {
    return {
      statusCode: 404,
      body: "La notification n'est pas disponible"
    }
  }

  try {
    const notification = await showNotification({ id: request.query.id })

    if (!notification) {
      return NotFoundError("La notification n'est pas disponible")
    }

    return Success(CandidateNotificationPage({ notification }))
  } catch (e) {
    console.log('getCandidateNotification Error', e)
    return SystemError(
      '<h1>Oops</h1><pre>' + JSON.stringify(e, null, 2) + '</pre>'
    )
  }
}

export { getCandidateNotification }
