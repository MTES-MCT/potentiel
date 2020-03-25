import { HttpRequest } from '../types'
import { showNotification } from '../useCases'
import { CandidateNotificationPage } from '../views/pages'
import { Success, NotFoundError, SystemError } from '../helpers/responses'
import { CandidateNotification } from '../entities'

const getCandidateNotification = async (request: HttpRequest) => {
  // console.log('Call to getCandidateNotification received', request.query)

  if (!request.query.id) {
    return NotFoundError("La notification n'est pas disponible")
  }

  const notificationResult = await showNotification({ id: request.query.id })

  return notificationResult.match({
    some: (notification: CandidateNotification) =>
      Success(CandidateNotificationPage({ request, notification })),
    none: () => NotFoundError("La notification n'est pas disponible")
  })
}

export { getCandidateNotification }
