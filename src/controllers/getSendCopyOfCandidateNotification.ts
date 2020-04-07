import { sendCandidateNotification } from '../useCases'
import { Redirect, SystemError, Success } from '../helpers/responses'
import { Controller, HttpRequest } from '../types'
import ROUTES from '../routes'
import _ from 'lodash'
import moment from 'moment'

const getSendCopyOfCandidateNotification = async (request: HttpRequest) => {
  // console.log(
  //   'Call to getSendCopyOfCandidateNotification received',
  //   request.body,
  //   request.query
  // )

  if (!request.user || !['admin', 'dgec'].includes(request.user.role)) {
    return SystemError('User must be logged in as admin')
  }

  const { projectId } = request.query

  if (!projectId) {
    return SystemError('Missing projectId')
  }

  // Send a notification to the current user instead of the project's representative
  const result = await sendCandidateNotification({
    projectId,
    overrideDestinationEmail: request.user.email
  })

  if (result.is_err()) {
    return SystemError(
      'Could not send notification to you ' + request.user.email
    )
  }

  return Success('Email sent')
}

export { getSendCopyOfCandidateNotification }
