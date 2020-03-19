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

  const notificationResult = await showNotification({ id: request.query.id })

  if (notificationResult.is_none()) {
    return NotFoundError("La notification n'est pas disponible")
  }

  return Success(
    CandidateNotificationPage({ notification: notificationResult.unwrap() })
  )
}

export { getCandidateNotification }
