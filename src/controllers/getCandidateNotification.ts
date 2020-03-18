import { HttpRequest } from '../types'
import { showNotification } from '../useCases'
import { CandidateNotificationPage } from '../views/pages'

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
      return {
        statusCode: 404,
        body: "La notification n'est pas disponible"
      }
    }

    return {
      statusCode: 200,
      body: CandidateNotificationPage({ notification })
    }
  } catch (e) {
    console.log('getCandidateNotification Error', e)
    return {
      statusCode: 500,
      body: '<h1>Oops</h1><pre>' + JSON.stringify(e, null, 2) + '</pre>'
    }
  }
}

export { getCandidateNotification }
