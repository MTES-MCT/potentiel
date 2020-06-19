import {
  projectRepo,
  userRepo,
  notificationRepo,
  projectAdmissionKeyRepo,
} from '../../dataAccess'
import {
  User,
  makeProjectAdmissionKey,
  makeNotification,
  Notification,
} from '../../entities'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import makeFakeProject from '../fixtures/project'

const addNotificationsForTests = async (request: HttpRequest) => {
  // console.log('addNotificationsForTests', request.body)
  const { notifications } = request.body

  if (!notifications) {
    console.log('tests/addNotificationsForTests missing notifications')
    return SystemError('tests/addNotificationsForTests missing notifications')
  }

  const builtNotifications = notifications
    .map((notification) => {
      return {
        type: notification.type,
        message: {
          email: notification.email,
          name: notification.name,
          subject: notification.subject,
        },
        context: JSON.parse(notification.context),
        variables: JSON.parse(notification.variables),
        status: notification.status,
        error: notification.error,
        ...(notification.createdAt
          ? { createdAt: Number(notification.createdAt) }
          : {}),
        ...(notification.updatedAt
          ? { updatedAt: Number(notification.updatedAt) }
          : {}),
      }
    })
    .map(makeNotification)

  await Promise.all(builtNotifications.map(notificationRepo.save))

  console.log(
    'addNotificationsForTests inserted ' +
      builtNotifications.length +
      ' notifications'
  )

  return Success('success')
}

export { addNotificationsForTests }
